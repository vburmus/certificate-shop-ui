import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const filterSlice = createSlice({
    name: 'filter',
    initialState:  {
        loading: false,
        error: '',
        tags: [] as number[],
        input: '',
    },
    reducers: {
        addInputFilter: (state, action: PayloadAction<string>) => {
            state.input = action.payload;
        },
        addTagFilter: (state, action: PayloadAction<number>) => {
            if(!state.tags.includes(action.payload))
                state.tags.push(action.payload);
        },
        removeInputFilter: (state) => {
            state.input = ""
        },
        removeTagFilter: (state, action: PayloadAction<number>) => {
            state.tags = state.tags.filter((id) => id !== action.payload)
        },
        removeTagFilters: (state) => {
            state.tags =[]
        },
        clearFilters: (state) => {
            state.tags = []
            state.input = ""
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error  = action.payload
        }
    }
});

export const {addInputFilter, addTagFilter,removeTagFilters, removeTagFilter, removeInputFilter, clearFilters,setError} = filterSlice.actions
export default filterSlice.reducer