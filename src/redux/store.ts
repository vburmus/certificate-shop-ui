import {configureStore} from '@reduxjs/toolkit'
import filterReducer from './filterSlice'
import pageReducer from './pageSlice';

const store = configureStore({
    reducer:{
        page:pageReducer,
        filter: filterReducer
    }
})
export default store;
