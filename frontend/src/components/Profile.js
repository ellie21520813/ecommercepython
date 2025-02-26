import React, {useEffect} from 'react'
import {Link, useNavigate} from "react-router-dom";
import { toast } from 'react-toastify';
import AxiosInstance from "../utils/AxiosInstance";
import {useSelector, useDispatch} from "react-redux";
import {fetchOrders} from "../redux/actions/ordersActions";

const Profile = () => {
  const jwt=localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector(state => state.order);
  console.log(orders)

   useEffect(() => {
     if (jwt === null && !user) {
         navigate('/login')
     }else{
      getSomeData()
     }

   }, [jwt, user])
    useEffect(()=>{
      dispatch(fetchOrders())
  },[dispatch])

  const getSomeData =async ()=>{
      const res =await AxiosInstance.get('get-something/')
      console.log(res.data)
  }
  return (
      <div>
          <div className='container'>
              <h2>hi {user && user.name}</h2>
              <p style={{textAlign: 'center',}}>welcome to your profile</p>
          </div>
          <h2 style={{textAlign: 'left'}}>Your Orders</h2>
          <div>
              {orders === null?(
                  <h3>You haven't orders</h3>
              ):(
                  orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((order) => (
                      <div className="order-info" key={order.id}>
                          <div >
                              <h2>Order ID: {order.id}</h2>
                              <p><strong>Name:</strong> {order.name_order}</p>
                              <p><strong>Phone:</strong> {order.phone_order}</p>
                              <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
                              <p><strong>Total Price:</strong> ${order.total_price}</p>
                          </div>
                          {order.items.map((item) => (
                              <div className="product-detail" key={item.id}>
                                  <div>
                                      <img src={`http://localhost:8000${item.product.image}`} alt={item.product.name} className="my-img"/>
                                  </div>
                                  <div className="detail-card">
                                      <h1>{item.product.name}</h1>
                                      <p className="product-description">{item.product.description}</p>
                                      <p>Price: {item.product.price}</p>
                                      <p>Quantity: {item.quantity}</p>
                                      <p>Total price: {item.product.price * item.quantity}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ))
              )}
        </div>
      </div>
  )
}

export default Profile