const initialState =[];

const myProductReducers = (state = initialState, action) =>{
    switch(action.type){
        case 'SET_MY_PRODUCTS':
            return action.payload;

        case 'DELETE_MY_PRODUCTS':
            return state.filter(myproduct => myproduct.id!== action.payload);
    
        default:
            return state;
    }
};

export default myProductReducers


