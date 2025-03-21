import axios from "axios";
import AxiosInstance from "../../utils/AxiosInstance";

export const fetchOrders = ()=> async (dispatch)=>{
    try{
        const response = await AxiosInstance.get("orders/");
        dispatch({
            type: 'SET_ORDERS',
            payload: response.data
        });
    }
    catch (e){
        console.error(e.response?.data)
        console.error("Error fetching orders", e);
    }
}

export const createOrder = (order)=> async (dispatch)=>{
    try{
        const response = await AxiosInstance.post('orders/', order);
        console.log("Order created successfully:", response.data);
        if (response.status === 201) {
            dispatch({
                type: 'ADD_ORDERS',
                payload: response.data
            });
            alert('Order created successfully');
        }
    }
    catch (e){
        console.error(e.response?.data)
        console.error("Error creating order", e);
        alert('Error creating order')

    }

}

