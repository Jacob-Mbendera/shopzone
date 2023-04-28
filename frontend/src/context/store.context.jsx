import { createContext, useReducer } from "react";

export const Store  = createContext();

const initialState = {
    cart: {

        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')): [],
        shippingAddress:localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) :{ location:{} },
        paymentMethod:localStorage.getItem('paymentMethod') ? localStorage.getItem('paymentMethod') :''

    },

    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
    fullBox: false,
}

const reducer = (state, action)=>{

    switch(action.type){
        case 'ADD_CART_ITEM':
            //add to cart
            const newCartItem = action.payload;
            const existCartItem = state.cart.cartItems.find( (item) => 
                item._id === newCartItem._id);
                    //cartItem  = existing items  ?                               update existing item with newCartItem              :  else  add new item to cartItems
                const cartItems =  existCartItem ? state.cart.cartItems.map( (item) => item._id ===  existCartItem._id ? newCartItem : item) : [...state.cart.cartItems, newCartItem]
                //if we already have the item in the cart, we need to use map() function on cartItems to UPDATE the newCartItem with the already existing cart item(item) to avoid creating duplicates
                //if existCartItem is null it means its new item so we need to add it to the end of the Array hence [...state.cart.cartItems, newCartItem]

                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                return{ ...state,
                    cart: {...state.cart, cartItems} //cartItems we just updated above.
                };
                
                //have used block {} because dont wanna a mix up cartItems above and below
        case 'REMOVE_CART_ITEM': {
            //Only return items whose id has not been passed/come up i.e remove the item whose id is passed
            const cartItems = state.cart.cartItems.filter((item) =>
                item._id !== action.payload._id //if the item id is not equal to current id, return it otherwise remove(filter())
                                                //if item id is equal to current payload , remove item
            );

            return {...state, cart: {...state.cart, cartItems}}
        }

        case 'SIGN_IN_USER':
            return{ 
                ...state, 
                userInfo: action.payload,

            }

        case 'SIGN_OUT':
            return{
                ...state,
                userInfo: null,
                cart:{
                    cartItems: [],
                    shippingAddress:{},
                    paymentMethod: '',
                }
            }
        

        case 'SAVE_SHIPPING_ADDRESS':
            return{
                ...state,
                cart:{
                    ...state.cart,
                    shippingAddress: action.payload,
                }

            }
        case 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION':
            return {
                ...state,
                cart: {
                ...state.cart,
                shippingAddress: {
                    ...state.cart.shippingAddress,
                    location: action.payload,
                },
                },
            };

        case 'SAVE_PAYMENT_METHOD':
            return{
                ...state,
                cart:{
                    ...state.cart,
                    paymentMethod: action.payload,
                }
            }

        case 'CLEAR_CART':
            return{
                ...state,
                cart:{
                    ...state.cart,
                    cartItems: [],
                }
            }

        case 'SET_FULLBOX_ON':
            return{ ...state, fullBox: true}

        case 'SET_FULLBOX_OFF':
            return{ ...state, fullBox: false}
            

        default:
            return state;
    }
}

export const  StoreProvider = (props) =>{
    const [state, dispatch] = useReducer(reducer, initialState);
    
    const value = {state, dispatch};

    return <Store.Provider value={value} > {props.children} </Store.Provider>
}