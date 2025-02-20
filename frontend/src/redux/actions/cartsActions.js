import axios from "axios";

export  const  fetchCarts = ()=> async (dispatch)=>{
    try{
        const token = JSON.parse(localStorage.getItem('token'))
        const response = await axios.get("http://localhost:8000/api/carts",{
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"

            }
        })
        dispatch({type:'SET_CARTS', payload: response.data});
    } catch(e){
        console.error("error to fetching",e);
    }
};