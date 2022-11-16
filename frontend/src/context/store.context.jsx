import { createContext, useReducer } from "react";

export const Store  = createContext();

const initialState = {
    cart: {
        cartItems: [],

    },
}

const reducer = (state, action)=>{

    switch(action.type){
        case 'ADD_CART_ITEM':
            //add to cart
            const newCartItem = action.payload;
            const existCartItem = state.cart.cartItems.find( (item) => 
                item._id === newCartItem._id);

                const cartItems =  existCartItem ? state.cart.cartItems.map( (item) => item._id ===  existCartItem._id ? newCartItem : item) : [...state.cart.cartItems, newCartItem]
                //if we already have the item in the cart, we need to use map() function on cartItems to UPDATE the current item(existCartItem) with the new item(newCartItem)
                //if existCartItem is null it means its new item so we need to add it to the end of the Array hence [...state.cart.cartItems, newCartItem]


                return{ ...state,
                    cart: {...state.cart, cartItems} //cartItems we just updated above.
                };

        default:
            return state;
    }
}

export const  StoreProvider = (props) =>{
    const [state, dispatch] = useReducer(reducer, initialState);
    
    const value = {state, dispatch};

    return <Store.Provider value={value} > {props.children} </Store.Provider>
}