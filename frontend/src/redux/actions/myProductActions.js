import axios from "axios";
import AxiosInstance from "../../utils/AxiosInstance";

export const getMyProducts = ()=> async (dispatch)=>{
    try{
        const response = await AxiosInstance.get('my-products/');
        dispatch({
            type: 'SET_MY_PRODUCTS',
            payload: response.data});
    }
    catch(error){
        console.error(error.response?.data);
        console.error('Error fetching my products',error);
    }
}

export const deleteMyProduct = (myproductId)=> async (dispatch)=>{
    try{
        await AxiosInstance.delete(`my-products/${myproductId}/`);
        dispatch({type:'DELETE_MY_PRODUCTS', payload: myproductId
        })
    }catch (e){
        console.error(e.response?.data);
        console.error(e);
    }
}