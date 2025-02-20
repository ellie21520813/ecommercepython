import { legacy_createStore as createStore ,applyMiddleware, combineReducers} from "redux";
import {thunk} from "redux-thunk";
import productsReducer from '../reducers/productsReducers';
import categoriesReducers from '../reducers/catogoriesReducers';
import cartsReducers from "../reducers/cartsReducers";

const rootReducer = combineReducers({
    categories : categoriesReducers,
    products : productsReducer,
    carts : cartsReducers,
})
const store =   createStore(rootReducer, applyMiddleware(thunk));

export default store;