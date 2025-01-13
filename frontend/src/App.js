import './App.css';
import HomePage from "./components/HomePage";
import ProductDetails from "./components/ProductDetails";
import SearchResultsPage from "./components/SearchResultsPage";
import CartPage from "./components/CartPage";
import {Link, useNavigate, Route, Routes} from "react-router-dom";
import React, {useState} from "react";
import CategoryPage from "./components/CategoryPage";
import CheckoutPage from "./components/CheckoutPage";
import Signup from "./components/Signup";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PasswordResetRequest from './components/PasswordResetRequest';
import ResetPassword from './components/ResetPassword';
import Profile from './components/Profile';
import VerifyEmail from './components/VerifyEmail';
import Login from './components/Login';
import AxiosInstance from "./utils/AxiosInstance";


function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    }
    const [cart, setCart] = useState(
        (localStorage.getItem("cart") !== null ? JSON.parse(localStorage.getItem("cart")) : [])
    );
    const refresh = JSON.parse(localStorage.getItem('refresh_token'))
    const userInfor = JSON.parse(localStorage.getItem('user'));


    const handleLogout = async () => {

        if (!refresh) {
            alert("Refresh token not found");
            return;
        }

        try {
            const res = await AxiosInstance.post('logout/', {refresh_token: refresh});

            if (res.status === 204) {
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                navigate('/');
                alert("Logout successful");
            }
        } catch (error) {
            console.error("Logout failed:", error);
            if (error.response) {
                alert("Logout failed: " + error.response.data.message || "Unknown error");
            } else {
                alert("Logout failed: Network error");
            }
        }
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchQuery.trim() !== '') {
            navigate(`/search?q=${searchQuery}`);
        }
    }
    return (

        <div>
            {/*navbar start*/}
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Shopping <i className="fa-solid fa-cart-shopping"></i></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0" >
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/signup  ">Link</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <p className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                   aria-expanded="false">
                                    Category
                                </p>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item"
                                              to="http://localhost:3000/categories/accessories">Accessories</Link></li>
                                    <li><Link className="dropdown-item"
                                              to="http://localhost:3000/categories/computers">Computers</Link>
                                    </li>
                                    <li><Link className="dropdown-item"
                                              to="http://localhost:3000/categories/tvs">Phones</Link></li>
                                    <li><Link className="dropdown-item"
                                              to="http://localhost:3000/categories/phones">TVs</Link></li>
                                    <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>
                                    <li><Link className="dropdown-item" to="/dashboard">Account</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/cart">Cart ({cart.length})</Link>
                            </li>
                            <form className="navbar navbar-expand-lg navbar-light bg-light input-form " role="search"
                                  onSubmit={handleSubmit}>
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <button className="btn btn-outline-success" type="submit">Search</button>
                            </form>
                        </ul>

                        {!refresh ?
                            (
                                <div className="nav-siglog">
                                    <div className="nav-item">
                                        <Link className="nav-link" to="/signup">Signup</Link>
                                    </div>
                                    <div className="nav-item">
                                        <Link to="/login" className="nav-link">Login</Link>
                                    </div>
                                </div>) : (
                                <div className="nav-item dropdown">
                                    <p className="nav-link dropdown-toggle" href="#" role="button"
                                       data-bs-toggle="dropdown"
                                       aria-expanded="false">
                                        {userInfor.name}
                                    </p>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-item"
                                                  to="/dashboard">Profile</Link>
                                        </li>
                                        <li><p className="dropdown-item"
                                               onClick={handleLogout}>Logout</p>
                                        </li>
                                    </ul>
                                </div>
                            )}

                    </div>
                </div>
            </nav>
            {/*navbar end*/}
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path='/products/:slug' element={<ProductDetails/>}/>
                <Route path='/search' element={<SearchResultsPage/>}/>
                <Route path='/categories/:slug' element={<CategoryPage/>}/>
                <Route path='/cart' element={<CartPage cart={cart} setCart={setCart}/>}/>
                <Route path={'/checkout'} element={<CheckoutPage cart={cart} setCart={setCart}/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/otp/verify'} element={<VerifyEmail/>}/>
                <Route path='/dashboard' element={<Profile/>}/>
                <Route path='/forget-password' element={<PasswordResetRequest/>}/>
                <Route path='/password-reset-confirm/:uid/:token' element={<ResetPassword/>}/>


                {/*add more routes as needed*/}
            </Routes>
        </div>
    );
}

export default App;
