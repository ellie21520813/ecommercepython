import React, {useEffect, useState} from 'react';
import {Link,useNavigate, useParams} from "react-router-dom";

const CartPage=({cart, setCart})=>{
    const navigate = useNavigate();
    const handleRemoveFromCart = (itemToRemove)=>{
        const updateCart = cart.filter((item)=> item.id !== itemToRemove.id);
        localStorage.setItem("cart", JSON.stringify(updateCart));
        setCart(updateCart);
    }

    const handleUpdateQuantity = (item, newQuantity)=>{
        const updateCart = cart.map((cartItem)=> {
            if(item.id === cartItem.id){
                return {...cartItem, quantity: newQuantity}
            }
            return cartItem;
        });
        localStorage.setItem("cart", JSON.stringify(updateCart));
        setCart(updateCart);
    }
    const handleCheckout =()=>{
        navigate('/checkout');

    }

    const calculateTotal=()=>{
        return cart.reduce((total, item)=> total + (parseFloat(item.price) * item.quantity), 0);
    }
    return(
        <div className="cart-page">
            <h1>Your cart</h1>
            {cart.length === 0?(
                <p>No items in the cart</p>
            ):(
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {cart.map((item) =>(
                        <tr key={item.id}>
                            <td>
                                <Link to={`/products/${item.slug}`}>{item.name}</Link>
                            </td>
                            <td>${parseFloat(item.price).toFixed(2)}</td>
                            <td>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e)=>handleUpdateQuantity(item, parseInt(e.target.value))}
                                />
                            </td>
                            <td>
                                ${(parseFloat(item.price )* item.quantity).toFixed(2)}
                            </td>
                            <td>
                                <button onClick={()=>handleRemoveFromCart(item)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            <div>
                <h2>Total: ${calculateTotal().toFixed(2)}</h2>
                <button onClick={handleCheckout}>Proceed to checkout</button>
            </div>
        </div>
    )
};


export default CartPage