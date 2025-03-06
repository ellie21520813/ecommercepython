import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";

const RegisteVendor = ()=>{
    const navigate = useNavigate()
    const [formdata, setFormData] = useState({
        bio:"",
        contact_details:"",
        bank_details:"",
        shipping_policy:"",
        return_policy:"",
    })
    const {bio, contact_details, bank_details, shipping_policy, return_policy} = formdata
    const handleOnchange =(e)=>{
        setFormData({...formdata, [e.target.name]: e.target.value})
    }
    const handlesubmitRegister= async (e)=>{
        e.preventDefault()
        try{
            const token = JSON.parse(localStorage.getItem('token'))
            console.log(formdata)
            const response = await axios.post('http://localhost:8000/api/vendor/',formdata,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            console.log(response)
            if(response.status  === 201){
                navigate('/dashboard')
                alert('Vendor Registration Successful')
            }
        }
        catch(error){
            console.error(error.response?.data)
        }
    }

    return(
        <div>
            <h1>Vendor Registration</h1>
            <form onSubmit={handlesubmitRegister}>
                <div>
                    <label htmlFor="bio">Bio</label>
                    <input
                        type="text"
                        id="bio"
                        name="bio"
                        value={bio}
                        onChange={handleOnchange}
                        required/>
                </div>
                <div>
                    <label htmlFor="contact_details">Contact Details</label>
                    <input
                        type="text"
                        id="contact_details"
                        name="contact_details"
                        value={contact_details}
                        onChange={handleOnchange}
                        required/>
                </div>
                <div>
                    <label htmlFor="bank_details">Bank Details</label>
                    <input
                        type="text"
                        id="bank_details"
                        name="bank_details"
                        value={bank_details}
                        onChange={handleOnchange}
                        required/>
                </div>
                <div>
                    <label htmlFor="shipping_policy">Shipping Policy</label>
                    <input
                        type="text"
                        id="shipping_policy"
                        name="shipping_policy"
                        value={shipping_policy}
                        onChange={handleOnchange}
                        required/>
                </div>
                <div>
                    <label htmlFor="return_policy">Return Policy</label>
                    <input
                        type="text"
                        id="return_policy"
                        name="return_policy"
                        value={return_policy}
                        onChange={handleOnchange}
                        required/>
                </div>
                <button  type='submit'>Register Vendor</button>
            </form>
        </div>
    )
}

export default RegisteVendor;