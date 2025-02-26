const initialState = []

const orderReducer = (state = initialState, action) => {
    switch(action.type){
        case 'SET_ORDERS':
            return action.payload
        default:
            return state
    }
}

export default orderReducer