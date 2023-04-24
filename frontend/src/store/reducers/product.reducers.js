import { PRODUCT_DETAILS_ACTION_TYPES, PRODUCT_LIST_ACTION_TYPES } from "../constants/product.constants";


export const productListReducer = (state = { loading: true,  products: [] }, action)=>{
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

export const productDetailsReducer = (state = { loading: true,  product: {} }, action)=>{
    switch(action.type){
  
        case PRODUCT_DETAILS_ACTION_TYPES.FETCH_REQUEST:
            return{loading: true}
  
        case PRODUCT_DETAILS_ACTION_TYPES.FETCH_SUCCESS:
            return{
                product: action.payload,
                loading: false,
            }
  
        case PRODUCT_DETAILS_ACTION_TYPES.FETCH_FAIL:
            return{
                error: action.payload,
                loading: false}

        default:
         return state;
        }
  };