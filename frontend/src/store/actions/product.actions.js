import  Axios  from "axios"
import { PRODUCT_DETAILS_ACTION_TYPES, PRODUCT_LIST_ACTION_TYPES } from "../constants/product.constants";
import { getError } from "../../utils/errors.utils";

export const  listProducts = () => async(dispatch)=>{
    dispatch({type: PRODUCT_LIST_ACTION_TYPES.FETCH_REQUEST})

    try {
        const { data } = await Axios.get('/api/products');
        dispatch({type: PRODUCT_LIST_ACTION_TYPES.FETCH_SUCCESS, payload: data})
    } catch (err) {
        dispatch({type: PRODUCT_LIST_ACTION_TYPES.FETCH_FAIL, payload:getError(err)})
    }
}



export const showProductDetails= (slug) => async(dispatch) =>{

    dispatch({type: PRODUCT_DETAILS_ACTION_TYPES.FETCH_REQUEST, payload: slug})
   
    try {
        const { data } = await Axios.get(`/api/products/slug/${slug}`) 
        dispatch({type: PRODUCT_DETAILS_ACTION_TYPES.FETCH_SUCCESS, payload: data})
    } catch (err) {
        dispatch({type: PRODUCT_DETAILS_ACTION_TYPES.FETCH_FAIL, payload: getError(err) })
    }

} 