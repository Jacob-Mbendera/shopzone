import  Axios  from "axios"
import { PRODUCT_LIST_ACTION_TYPES } from "../constants/product.constants";

export const  listProducts = () => async(dispatch)=>{
    dispatch({type: PRODUCT_LIST_ACTION_TYPES.FETCH_REQUEST})

    try {
        const { data } = await Axios.get('/api/products');
        dispatch({type: PRODUCT_LIST_ACTION_TYPES.FETCH_SUCCESS, payload: data})
    } catch (err) {
        dispatch({type: PRODUCT_LIST_ACTION_TYPES.FETCH_FAIL, payload: err.message})
    }
}