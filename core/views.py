from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.db import transaction
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import serializers
import logging
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404



from .models import (
    User, Vendor, Category, Product, Order, OrderItem, Cart, CartItem, Shipping, Payment, Coupon, Review, Wishlist,
    Notification, Blog, Contact, FAQ, Analytics, Configuration, Tax, Subscription, Refund, OneTimePassword
)
from .serializers import (
    UserSerializer, VendorSerializer, CategorySerializer, ProductSerializer, OrderSerializer, OrderItemSerializer,
    CartSerializer, CartItemSerializer, ShippingSerializer, PaymentSerializer, CouponSerializer, ReviewSerializer,
    WishlistSerializer, NotificationSerializer, BlogSerializer, ContactSerializer, FAQSerializer, AnalyticsSerializer,
    ConfigurationSerializer, TaxSerializer, SubscriptionSerializer, RefundSerializer, UserRegisterSerializer,
    LoginSerializer, PasswordResetRequestSerializer, SetNewPasswordSerializer, LogoutUserSerializer
)
from rest_framework import viewsets, status

from .utils import send_generated_otp_to_email
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes


@permission_classes([AllowAny])
class RegisterView(GenericAPIView):
    serializer_class = UserRegisterSerializer

    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            user_data = serializer.data
            send_generated_otp_to_email(user_data['email'], request)
            return Response({
                'data': user_data,
                'message': 'thanks for signing up a passcode has be sent to verify your email'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([AllowAny])
class VerifyUserEmail(GenericAPIView):
    def post(self, request):
        try:
            passcode = request.data.get('otp')
            user_pass_obj = OneTimePassword.objects.get(otp=passcode)
            user = user_pass_obj.user
            if not user.is_verified:
                user.is_verified = True
                user.save()
                cart = Cart.objects.create(user=user)
                return Response({
                    'message': 'account email verified successfully'
                }, status=status.HTTP_200_OK)
            return Response({'message': 'passcode is invalid user is already verified'},
                            status=status.HTTP_204_NO_CONTENT)
        except OneTimePassword.DoesNotExist as identifier:
            return Response({'message': 'passcode not provided'}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([AllowAny])
class LoginUserView(GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@permission_classes([AllowAny])
class PasswordResetRequestView(GenericAPIView):
    serializer_class = PasswordResetRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response({'message': 'we have sent you a link to reset your password'}, status=status.HTTP_200_OK)
        # return Response({'message':'user with that email does not exist'}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([AllowAny])
class PasswordResetConfirm(GenericAPIView):

    def get(self, request, uidb64, token):
        try:
            user_id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=user_id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'message': 'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({'success': True, 'message': 'credentials is valid', 'uidb64': uidb64, 'token': token},
                            status=status.HTTP_200_OK)

        except DjangoUnicodeDecodeError as identifier:
            return Response({'message': 'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)


class TestingAuthenticatedReq(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {
            'msg': 'its works',
            'user': request.user.id
        }
        return Response(data, status=status.HTTP_200_OK)


@permission_classes([AllowAny])
class SetNewPasswordView(GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': "password reset is succesful"}, status=status.HTTP_200_OK)


@permission_classes([IsAuthenticated])
class LogoutApiView(GenericAPIView):
    serializer_class = LogoutUserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


@permission_classes([AllowAny])
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@permission_classes([AllowAny])
class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer


@permission_classes([AllowAny])
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


@permission_classes([AllowAny])
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


@permission_classes([IsAuthenticated])
class OrderViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        try:
            user = self.request.user
            if not user or not user.is_authenticated:
                return Response({"detail": "Authentication credentials were not provided."},
                                status=status.HTTP_401_UNAUTHORIZED)
            data = self.request.data
            order_items = data.get('order_items', [])
            shipping_address = data.get('shipping_address')
            if not order_items or not shipping_address:
                return Response({'message': 'shipping address and order items are required'},
                                status=status.HTTP_400_BAD_REQUEST)
            total_price = 0
            order = Order.objects.create(
                user=user,
                total_price=0,
                shipping_address=shipping_address,
                name_order= data.get('name_order'),
                phone_order= data.get('phone_order'),
                email_order= data.get('email_order')
            )
            for item in order_items:
                product_id = item.get('product_id')
                quantity = item.get('quantity')
                product = get_object_or_404(Product, id=product_id)
                if product.stock < quantity:
                    raise serializers.ValidationError({'message': 'Not enough stock for product'})
                total_price += product.price * quantity
                order_item = OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity
                )
                product = Product.objects.select_for_update().get(id=product_id)
                product.stock -= quantity
                product.save()
            order.total_price += total_price
            order.save()
            CartItem.objects.filter(cart=user.carts).delete()
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        #serializer.save(user=self.request.user)


    def list(self, request):
        user = self.request.user
        order = Order.objects.filter(user=user)
        serializer = OrderSerializer(order,many=True)
        return Response(serializer.data)

    '''def post(self, request):
        user = request.user
        print(f"User from request: {user} ({type(user)})")
        if not user or not user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."},status=status.HTTP_401_UNAUTHORIZED)
        data = request.data
        order_items = data.get('order_items', [])
        shipping_address = data.get('shipping_address', None)

        if not order_items:
            return Response({'message': 'order items are required'}, status=status.HTTP_400_BAD_REQUEST)
        total_price = 0
        order = Order.objects.create(user=user, total_price=0, shipping_address=shipping_address)
        for item in order_items:
            product_id = item.get('product_id')
            quantity = item.get('quantity')

            product = Product.objects.get(id=product_id)
            if product.stock < quantity:
                raise serializers.ValidationError({'message': 'Not enough stock for product'})

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
            )
            total_price += product.price * quantity
            product.stock -= quantity
            product.save()
        order.total_price = total_price
        order.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)'''

@permission_classes([AllowAny])
class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer


@permission_classes([IsAuthenticated])
class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    authentication_classes = [JWTAuthentication]

    def list(self, request):
        user = self.request.user
        cart = Cart.objects.filter(user=user)
        serializer = CartSerializer(cart, many=True)
        return Response(serializer.data)

class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
            try:
                product_id = self.request.data.get('product')
                product = Product.objects.get(id=product_id)
                quantity = self.request.data.get('quantity')
                if not quantity:
                    return Response({'message': 'Invalid product or quantity'}, status=status.HTTP_400_BAD_REQUEST)
                if product.stock < quantity:
                    return Response({'message': 'Not enough stock for product'}, status=status.HTTP_400_BAD_REQUEST)
                cart_item, item_created = CartItem.objects.get_or_create(cart=self.request.user.carts, product=product,
                                                                        quantity=quantity)
                if not item_created:
                    cart_item.quantity += quantity
                    cart_item.save()
                else:
                    cart_item.quantity = quantity
                    cart_item.save()
                return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    '''def post(self,request):
        try:
            quantity = request.data.get('quantity')
            product_id = request.data.get('product')
            if not product_id or not quantity:
                return Response({'message': 'Product ID and quantity are required'}, status=status.HTTP_400_BAD_REQUEST)
            product = Product.objects.get(id=product_id)
            if product.stock < quantity:
                return Response({'message': 'Not enough stock for product'}, status=status.HTTP_400_BAD_REQUEST)
            cart_item, item_created = CartItem.objects.get_or_create(cart=self.request.user.carts, product=product.id)


            if not item_created:
                cart_item.quantity += quantity
                cart_item.save()
            else:
                cart_item.quantity = quantity
                cart_item.save()

            product.stock -= quantity
            product.save()
            return Response(CartItemSerializer(cart_item).data,  status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
'''
    def destroy(self, request, pk=None):
        try:
            print(f"Received pk: {pk}")
            cart_item = self.get_object()
            cart_item.delete()
            return Response({'message': 'Cart item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({'message': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([AllowAny])
class ShippingViewSet(viewsets.ModelViewSet):
    queryset = Shipping.objects.all()
    serializer_class = ShippingSerializer


@permission_classes([AllowAny])
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


@permission_classes([AllowAny])
class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer


@permission_classes([AllowAny])
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


@permission_classes([AllowAny])
class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer


@permission_classes([AllowAny])
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer


@permission_classes([AllowAny])
class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer


@permission_classes([AllowAny])
class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer


@permission_classes([AllowAny])
class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer


@permission_classes([AllowAny])
class AnalyticsViewSet(viewsets.ModelViewSet):
    queryset = Analytics.objects.all()
    serializer_class = AnalyticsSerializer


@permission_classes([AllowAny])
class ConfigurationViewSet(viewsets.ModelViewSet):
    queryset = Configuration.objects.all()
    serializer_class = ConfigurationSerializer


@permission_classes([AllowAny])
class TaxViewSet(viewsets.ModelViewSet):
    queryset = Tax.objects.all()
    serializer_class = TaxSerializer


@permission_classes([AllowAny])
class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer


@permission_classes([AllowAny])
class RefundViewSet(viewsets.ModelViewSet):
    queryset = Refund.objects.all()
    serializer_class = RefundSerializer
