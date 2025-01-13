import { legacy_createStore as createStore ,applyMiddleware, combineReducers} from "redux";
import {thunk} from "redux-thunk";
import productsReducer from '../reducers/productsReducers';
import categoriesReducers from '../reducers/catogoriesReducers';

const rootReducer = combineReducers({
    categories : categoriesReducers,
    products : productsReducer,
})
const store =   createStore(rootReducer, applyMiddleware(thunk));

export default store;