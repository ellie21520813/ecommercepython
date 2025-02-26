import axios from "axios";

export const fetchOrders = ()=> async (dispatch)=>{
    try{
        const token = JSON.parse(localStorage.getItem('token'))
        const response = await axios.get("http://localhost:8000/api/orders/",{
            headers:{
                Authorization:  `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        dispatch({
            type: 'SET_ORDERS',
            payload: response.data
        });
    }
    catch (e){
        console.error("Error fetching orders", e);
    }
}