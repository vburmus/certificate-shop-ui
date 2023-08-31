import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const pageSlice = createSlice({
    name: 'page',
    initialState: {
        currentPage: 1,
        loading:true
    }, 
    reducers: {
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setLoadingPage: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setCurrentPage,setLoadingPage} = pageSlice.actions;
export default pageSlice.reducer;