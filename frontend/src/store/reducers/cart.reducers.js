import { CART_ACTION_TYPES } from "../constants/cart.constants";
import { PRODUCT_DETAILS_ACTION_TYPES, PRODUCT_LIST_ACTION_TYPES } from "../constants/product.constants";


export const cartReducer = (state = { cartItems:[] }, action)=>{
    switch(action.type){
  
        case CART_ACTION_TYPES.ADD_CART_ITEM:
            const newItem = action.payload;
            const  existigItem = state.cartItems.find((item) => item.product === newItem.product );
            if(existigItem){
                return{
                    ...state,
            //if item === existing item; dont return item which is old item rather return newItem as Item, otherwise of they are not equal to each other returnthe previous item(item)
                    cartItems: state.cartItems.map((item) => item.product === existigItem.product ? newItem: item)
                }
            }else{
                return{
                    ...state,
                    //if the product does exist the add the new product
                    cartItems: [...state.cartItems, newItem]
                };
            }


        default:
         return state;
        }
  }