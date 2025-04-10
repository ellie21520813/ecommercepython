import axios from "axios";
import AxiosInstance from "../../utils/AxiosInstance";

const token = JSON.parse(localStorage.getItem('token'));
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

export const addProduct=(productData)=> async (dispatch)=>{
    try{
        const response = await axios.post("http://localhost:8000/api/my-products/", productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        });
        console.log('response: ',response)
        if (response.status === 201) {
            dispatch({
                type: 'ADD_PRODUCT',
                payload: response.data
            });
            alert('Product created successfully');
        }
    }
    catch (error) {
        console.log(error)
        console.error(error.response?.data)
        alert('Error adding product')
    }
}

export const updateProduct=(slug, dataUpdate)=> async (dispatch)=>{
    try{
        const response = await axios.put(`http://localhost:8000/api/my-products/${slug}/`, dataUpdate, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response)

            if (response.status === 200) {
                dispatch({
                    type: 'UPDATE_PRODUCT',
                    payload: response.data
                });
                alert('Product update successfully');
            }
        }
        catch(error){
            console.error('Error update product details',error);
            console.error(error.response?.data)
            console.error(error)
        }
}
