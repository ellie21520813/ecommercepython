import axios from "axios";

const token = JSON.parse(localStorage.getItem('token'));
export const getMyProducts = ()=> async (dispatch)=>{
    try{
        const response = await axios.get('http://127.0.0.1:8000/api/my-products/',{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        dispatch({
            type: 'SET_MY_PRODUCTS',
            payload: response.data});
    }
    catch(error){
        console.error('Error fetching my products',error);
    }
}

export const deleteMyProduct = (myproductId)=> async (dispatch)=>{
    try{
        await axios.delete(`http://localhost:8000/api/my-products/${myproductId}/`,{
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        dispatch({type:'DELETE_MY_PRODUCTS', payload: myproductId
        })
    }catch (e){
        console.error(e);
    }
}