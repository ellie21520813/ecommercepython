import axios from "axios";
import AxiosInstance from "../../utils/AxiosInstance";

export const fetchProducts = ()=> async (dispatch)  =>{
    try{
        const response = await AxiosInstance.get('products/');
        dispatch({
            type: 'SET_PRODUCTS',
            payload: response.data});
    }
    catch(error){
        console.error('Error fetching products',error);
    }
};

export const fetchProductsDetails=(slug)=> async (dispatch) =>{
    try{
        const response = await AxiosInstance.get(`products/${slug}/`);
        dispatch({
            type: 'SET_PRODUCT_DETAILS',
            payload: response.data
        });
    }
    catch(error){
        console.error('Error fetching product details',error);
    }
}

