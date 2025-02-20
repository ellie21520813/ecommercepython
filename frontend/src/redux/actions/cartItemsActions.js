import axios from "axios";

const token = JSON.parse(localStorage.getItem('token'));
export const fetchCartItems = ()=> async (dispatch)=>{
    try{
        const response = await axios.get('http://localhost:8000/api/cart-items',{
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        dispatch({type:'SET_CART_ITEMS',payload:response.data})

    }catch (e){
        console.error(e);
    }
}

export const deleteCartItems = (cartItemsId)=> async (dispatch)=>{
    try{
        await axios.delete(`http://localhost:8000/api/cart-items/${cartItemsId}/`,{
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        dispatch({type:'DELETE_CART_ITEMS', payload: cartItemsId})
    }catch (e){
        console.error(e);
    }
}