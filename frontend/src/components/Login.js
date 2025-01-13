import React, {useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import {ToastContainer, toast, Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "../utils/AxiosInstance";

const Login = () => {
    const navigate = useNavigate()
    const [logindata, setLogindata] = useState({
        email: "",
        password: ""
    })


    const handleOnchange = (e) => {
        setLogindata({...logindata, [e.target.name]: e.target.value})
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (logindata.email && logindata.password) {
            if (logindata) {

                const res = await AxiosInstance.post('login/', logindata)
                const response = res.data
                const user = {
                    'name': response.name,
                    'email': response.email
                }

                if (res.status === 200) {
                    localStorage.setItem('token', JSON.stringify(response.access_token))
                    localStorage.setItem('refresh_token', JSON.stringify(response.refresh_token))
                    localStorage.setItem('user', JSON.stringify(user))
                    await navigate('/')
                    alert('Login successful')
                } else {
                    alert('Login failed')
                }
            }
        } else {
            alert('Please fill in all fields')
        }

    }

    return (
        <div>
            <section>
                <div className="leaves">
                    <div className="set">
                        <div><img src="/imagelogin/b1.png" alt="leaf1"/></div>
                        <div><img src="/imagelogin/b2.png" alt="leaf2"/></div>
                        <div><img src="/imagelogin/b3.png" alt="leaf3"/></div>
                        <div><img src="/imagelogin/b4.png" alt="leaf4"/></div>
                        <div><img src="/imagelogin/b5.png" alt="leaf5"/></div>
                        <div><img src="/imagelogin/b2.png" alt="leaf6"/></div>
                        <div><img src="/imagelogin/b3.png" alt="leaf7"/></div>
                        <div><img src="/imagelogin/b4.png" alt="leaf8"/></div>
                    </div>
                </div>
                <img src="/imagelogin/4.png" className="bg" alt="background"/>

                <div className="login">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="inputBox">
                            <input
                                type="email"
                                placeholder="email"
                                className="email-form"
                                value={logindata.email}
                                name="email"
                                onChange={handleOnchange}
                            />
                        </div>
                        <div className="inputBox">
                            <input
                                type="password"
                                placeholder="password"
                                className="email-form"
                                value={logindata.password}
                                name="password"
                                onChange={handleOnchange}
                            />
                        </div>
                        <div className="inputBox">
                            <input type="submit" value="Login" className="submitButton" id="btn"/>
                        </div>
                        <p><Link className="signlink" to="/forget-password">Forgot Password?</Link></p>
                    </form>
                </div>
            </section>
        </div>
    )
}

export default Login
