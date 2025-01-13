from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    UserViewSet, VendorViewSet, CategoryViewSet, ProductViewSet, OrderViewSet, OrderItemViewSet, CartViewSet,
    CartItemViewSet, ShippingViewSet, PaymentViewSet, CouponViewSet, ReviewViewSet, WishlistViewSet,
    NotificationViewSet, BlogViewSet, ContactViewSet, FAQViewSet, AnalyticsViewSet, ConfigurationViewSet, TaxViewSet,
    SubscriptionViewSet, RefundViewSet, RegisterView, VerifyUserEmail, LoginUserView, PasswordResetConfirm,
    PasswordResetRequestView, SetNewPasswordView, LogoutApiView, TestingAuthenticatedReq
)
from rest_framework_simplejwt.views import (TokenRefreshView,)


router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'vendor', VendorViewSet)
router.register(r'category', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)
router.register(r'carts', CartViewSet)
router.register(r'cart-items', CartItemViewSet)
router.register(r'shippings', ShippingViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'coupons', CouponViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'wishlists', WishlistViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'blogs', BlogViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'faqs', FAQViewSet)
router.register(r'analytics', AnalyticsViewSet)
router.register(r'configurations', ConfigurationViewSet)
router.register(r'taxes', TaxViewSet)
router.register(r'subscriptions', SubscriptionViewSet)
router.register(r'refunds', RefundViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/signup/', RegisterView.as_view(), name='register'),
    path('api/verify-email/', VerifyUserEmail.as_view(), name='verify-email'),
    path('api/login/', LoginUserView.as_view(), name='login'),
    path('api/logout/', LogoutApiView.as_view(), name='logout'),
    path('api/password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('api/password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirm.as_view(), name='reset-password-confirm'),
    path('api/set-new-password/', SetNewPasswordView.as_view(), name='set-new-password'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/get-something/', TestingAuthenticatedReq.as_view(), name='just-for-testing'),

]
