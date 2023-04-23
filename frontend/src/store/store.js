import {applyMiddleware, combineReducers, compose, legacy_createStore as createStore} from 'redux'
import thunk from 'redux-thunk'
import { productListReducer } from './reducers/product.reducers';

const initialState = {};
const reducer = combineReducers({
    productList: productListReducer,
});
const enhancedComposer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, initialState, enhancedComposer(applyMiddleware(thunk)));

export default store;