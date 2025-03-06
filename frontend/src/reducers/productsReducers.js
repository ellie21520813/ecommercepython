const initialState =[];

const productsReducer = (state = initialState, action) =>{
    switch(action.type){
        case 'SET_PRODUCTS':
            return action.payload;

        case 'SET_MY_PRODUCTS':
            return action.payload;

        default:
            return state;
    }
};



export default productsReducer;