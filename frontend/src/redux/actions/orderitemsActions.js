import axios from "axios";

export const fetchOrderItems = ()=> async (dispatch)=>{
    try{
        const response = await axios.get('http://localhost:8080/order-items')
        dispatch({
            type: 'SET_ORDER_ITEMS',
            payload: response.data
        })
    }
    catch (err) {
        console.error("error fetching order items", err)
    }
}