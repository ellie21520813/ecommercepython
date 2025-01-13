import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import  'react-phone-input-2/lib/style.css';

const CheckoutPage=({cart, setCart})=>{
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [phone, setPhone] = useState("");
    const [state, setState] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");

    const calculateTotal =()=>{
        return cart.reduce(
            (total, item)=> total + parseFloat(item.price)* item.quantity,0
        )
    }
    const handleSubmit=()=>{
        console.log("Order submission:",{
            fullName,
            email,
            country,
            phone,
            state,
            paymentMethod,
            cart,
            total: calculateTotal()
        })
        setCart([]);
        localStorage.removeItem("cart")
        if(paymentMethod === "momo"){
            navigate("/momo-payment")
        }
        else if(paymentMethod === "paypal"){
            navigate("/paypal-payment")
        }

    }
    return(
        <div>
            <h2>Checkout Page</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="fullName"> FullName: </label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email"> Email: </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone"> Phone: </label>
                    <PhoneInput
                        id="phone"
                        country={"vietnam"}
                        value={phone}
                        onChange={(value) => setPhone(value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="country"> Country: </label>
                    <input
                        type="text"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="state"> State: </label>
                    <input
                        type="text"
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                    />
                </div>
            </form>
            <div>
                <h4>Payment Method</h4>
                <div>
                    <input
                        type="radio"
                        id="momo"
                        name="paymentMethod"
                        value="momo"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                    />
                    <label htmlFor="momo"> Momo</label>
                </div>
                <div>
                    <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        value="paypal"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                    />
                    <label htmlFor="paypal"> PayPal</label>
                </div>
                <div>
                    <h4>Oder summary: </h4>
                    <p>Total: ${calculateTotal().toFixed(2)}</p>
                </div>
                <button type="submit">Place oder</button>

            </div>
        </div>
    )
}

export default CheckoutPage;