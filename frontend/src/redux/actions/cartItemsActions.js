import AxiosInstance from "../../utils/AxiosInstance";


export const fetchCartItems = ()=> async (dispatch)=>{
    try{
        const response = await AxiosInstance.get('cart-items/')
        dispatch(
            {
                type:'SET_CART_ITEMS',
                payload:response.data
            })

    }catch (e){
        console.error(e);
    }
}

export const deleteCartItems = (cartItemsId)=> async (dispatch)=>{
    try{
        await AxiosInstance.delete(`cart-items/${cartItemsId}/`);
        dispatch(
            {
                type:'DELETE_CART_ITEMS',
                payload: cartItemsId
            })
    }catch (e){
        console.error(e.response?.data);
        console.error(e);
    }
}