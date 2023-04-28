import Axios from "axios"
import { CART_ACTION_TYPES } from "../constants/cart.constants";

        //dispatch, getState are functions in redux thunk ; used to dispatch an action and get state of redux store
export const  addToCart = (productId, qty) => async(dispatch, getState) =>{

    const { data } = await Axios.get(`/api/products/${productId}`);
    dispatch({
        type: CART_ACTION_TYPES.ADD_CART_ITEM,
        payload: {
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            product: data._id,
            qty,
        },

    });
    //setting the carttItems in local storage; making it persistent so refreshing the page wont clart the cart
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));

}