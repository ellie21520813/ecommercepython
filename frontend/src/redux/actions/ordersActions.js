import axios from "axios";

const token = JSON.parse(localStorage.getItem('token'))

export const fetchOrders = ()=> async (dispatch)=>{
    try{
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

export const createOrder = (order)=> async (dispatch)=>{
    try{
        const response = await axios.post('http://localhost:8000/api/orders/', order,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Gửi token
                        "Content-Type": "application/json"
                        }
                    });
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

