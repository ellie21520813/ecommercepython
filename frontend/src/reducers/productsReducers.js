const initialState = {
    products: [],
    productDetails: null,
    newProduct: [],
};

const productsReducer = (state = initialState, action) =>{
    switch(action.type){
        case 'SET_PRODUCTS':
            return {
                ...state,
                products: action.payload
            }

        case 'SET_PRODUCT_DETAILS':
            return {
                ...state,
                productDetails: action.payload || null
            };

        case 'ADD_PRODUCT':
            return {
               ...state,
                newProduct: [...state.newProduct, action.payload]
            };

        case 'UPDATE_PRODUCT':
            return {
                ...state,
                products: state.products.map(product =>
                    product.slug === action.payload.slug ? action.payload : product
                ),
                productDetails: state.productDetails?.slug === action.payload.slug ? action.payload : state.productDetails
            };



        default:
            return state;
    }
};



export default productsReducer;