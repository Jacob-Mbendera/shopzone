import data from '../data/data';
import {applyMiddleware, compose, legacy_createStore as createStore} from 'redux'
import thunk from 'redux-thunk'

const initialState = {

}

const enhancedComposer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducer = (state, action) =>{
    return {products: data.products}
}

const store = createStore(reducer, initialState, enhancedComposer(applyMiddleware(thunk)));

export default store;