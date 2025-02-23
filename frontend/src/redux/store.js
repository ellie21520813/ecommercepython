import { legacy_createStore as createStore ,applyMiddleware, combineReducers} from "redux";
import {thunk} from "redux-thunk";
import productsReducer from '../reducers/productsReducers';
import categoriesReducers from '../reducers/catogoriesReducers';
import cartsReducers from "../reducers/cartsReducers";
import cartItemsReducers from "../reducers/cartItemsReducers";

let orderReducers;
let orderItemsReducers;
const rootReducer = combineReducers({
    categories : categoriesReducers,
    products : productsReducer,
    carts : cartsReducers,
    cartitems : cartItemsReducers,
    order : orderReducers,
    orderitemsL: orderItemsReducers
})
const store =   createStore(rootReducer, applyMiddleware(thunk));

export default store;