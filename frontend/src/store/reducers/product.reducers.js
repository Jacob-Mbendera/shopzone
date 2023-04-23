import { PRODUCT_LIST_ACTION_TYPES } from "../constants/product.constants";


export const productListReducer = (state = { products: [] }, action)=>{
    switch(action.type){
  
        case PRODUCT_LIST_ACTION_TYPES.FETCH_REQUEST:
            return{loading: true}
  
        case PRODUCT_LIST_ACTION_TYPES.FETCH_SUCCESS:
            return{
                products: action.payload,
                loading: false,
            }
  
        case PRODUCT_LIST_ACTION_TYPES.FETCH_FAIL:
            return{
                error: action.payload,
                loading: false}

        default:
         return state;
        }
  };