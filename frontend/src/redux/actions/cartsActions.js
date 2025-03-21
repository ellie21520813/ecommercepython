import axios from "axios";
import AxiosInstance from "../../utils/AxiosInstance";

export  const  fetchCarts = ()=> async (dispatch)=>{
    try{
        const response = await AxiosInstance.get("carts")
        dispatch({type:'SET_CARTS', payload: response.data});
    } catch(e){
        console.error("error to fetching",e);
    }
};