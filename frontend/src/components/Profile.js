import React, {useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import AxiosInstance from "../utils/AxiosInstance";

const Profile = () => {
  const jwt=localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate();

   useEffect(() => {
     if (jwt === null && !user) {
         navigate('/login')
     }else{
      getSomeData()
     }

   }, [jwt, user])

  const getSomeData =async ()=>{
      const res =await AxiosInstance.get('get-something/')
      console.log(res.data)
  }
  return (
    <div className='container'>
        <h2>hi {user && user.name}</h2>
        <p style={{textAlign:'center',}}>welcome to your profile</p>
    </div>
  )
}

export default Profile