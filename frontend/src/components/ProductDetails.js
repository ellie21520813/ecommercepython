import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";

const ProductDetails = ()=>{
    const {slug} = useParams();
    const [product, setProduct] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchProductDetails = async ()=>{
            try{
                const response = await axios.get(`http://127.0.0.1:8000/api/products/?slug=${slug}`);
                const data = response.data;
                const filteredProducts = data.filter((pro) => pro.slug === slug);
                if (filteredProducts.length > 0) {
                    setProduct(filteredProducts[0]);
                } else {
                    console.error('No product found with this slug');
                }
            }
            catch (error){
                console.log(error);
            }
        };
        fetchProductDetails();
        const cartData = localStorage.getItem("cart")
        if (cartData) {
            setCart(JSON.parse(cartData));
        }

    },[slug]);
    if (!product) {
        return <div>Loading...</div>;
    }

    const handleAddToCart = async (e) => {
        const token = JSON.parse(localStorage.getItem('token'))
        const cartItems ={
            product: product.id,
            quantity: quantity,
        };
        console.log("Cart request data:", cartItems);

        const updatedCart = cart.concat(cartItems);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
        try{
            const response = await axios.post("http://localhost:8000/api/cart-items/", cartItems,{
                    headers: {
                        Authorization: `Bearer ${token}`,  // Gửi token
                        "Content-Type": "application/json"
                        }
                    });
            console.log(response.data);
            if(response.status ===201){
                alert("Product added to cart successfully!");
                navigate('/cart');
            }
            else{
                alert("Failed to add product to cart!");
            }
        }  catch(error){
            console.log(error);
        }


    }

    const handleRemoveFromCart =(itemToRemove) => {
        const updateCart = cart.filter(item => item.id ===itemToRemove.id);
        localStorage.setItem("cart", JSON.stringify(updateCart));
        setCart(updateCart);
    }
   return (
       <div>
           <div className="product-detail">
               <div>
                   <img src={product.image} alt={product.name} className="my-img"/>
               </div>
               <div className="detail-card">
                   <h1>{product.name}</h1>
                   <p className="product-description">{product.description}</p>
                   <p>Price: {product.price}</p>
                   <p>Stock: {product.stock}</p>
                   <div className="shipping-infor">
                       <p>Shipping address: {product.shipping_address}</p>
                       <p>Shipping policy: <a href={product.shipping_policy}>Click here</a>for shipping policy </p>
                       <p>Return policy: <a href={product.return_policy}>Click here</a> for return policy </p>
                   </div>
                   <div className="label-quantity">
                       <label htmlFor="quantity">Quantity:</label>
                       <input
                           type="number"
                           id="quantity"
                           value={quantity}
                           min="1"
                           max={product.stock}
                           onChange={(e) => setQuantity(e.target.value)}/>
                   </div>
                   <button className="btn btn-primary" onClick={()=>handleAddToCart(product)}>Add product</button>
                   {cart.some((item)=> item.id === product.id)&& (
                       <button className="btn btn-primary" onClick={()=>handleRemoveFromCart(product)}>Remove product</button>
                   )}
               </div>
           </div>
           {product.vendor && (
               <div className="vendor-infor">
                   <h3>Vendor information</h3>
                   <p>Vendor: {product.vendor.user}</p>
                   <p>Contact: {product.vendor.contact_details}</p>
                   <p>Bio: {product.vendor.bio}</p>
               </div>
           )}


       </div>

   );

}


export default ProductDetails;