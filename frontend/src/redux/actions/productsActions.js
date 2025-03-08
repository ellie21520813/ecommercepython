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

export const addProduct=(productData)=> async (dispatch)=>{
    try{
        const response = await axios.post("http://localhost:8000/api/products/", productData, {
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
