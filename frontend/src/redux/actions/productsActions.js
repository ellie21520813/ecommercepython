import axios from "axios";

const token = JSON.parse(localStorage.getItem('token'));
export const fetchProducts = ()=> async (dispatch)  =>{
    try{
        const response = await axios.get('http://127.0.0.1:8000/api/products/');
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
        const response = await axios.get(`http://127.0.0.1:8000/api/products/${slug}/`);
        dispatch({
            type: 'SET_PRODUCT_DETAILS',
            payload: response.data
        });
    }
    catch(error){
        console.error('Error fetching product details',error);
    }
}
