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
            return{
                ...state,  //return prev state 
                cart: {
                    ...state.cart, //return prev state of the cart

                    cartItems: [
                        ...state.cart.cartItems, //return the prev state of cartItems[]
                        action.payload, //add the new item
                    ]
                }
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