import axios from "axios";

export const fetchOrders = ()=> async (dispatch)=>{
    try{
        const response = await axios.get("http://localhost:8080/orders");
        dispatch({
            type: 'SET_ORDERS',
            payload: response.data
        });
    }
    catch (e){
        console.error("Error fetching orders", e);
    }
}