import axios from "axios";

export const fetchOrderItems = ()=> async (dispatch)=>{
    try{
        const token = JSON.parse(localStorage.getItem('token'))
        const response = await axios.get('http://localhost:8000/api/order-items',{
            headers:{
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        dispatch({
            type: 'SET_ORDER_ITEMS',
            payload: response.data
        })
    }
    catch (err) {
        console.error("error fetching order items", err)
    }
}