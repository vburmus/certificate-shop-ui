import {User} from "../utils/types";

interface RootState {
    user: {
        loading: boolean;
        user: User | null;
        error: string | null;
    },
    page: {
        currentPage:number,
        loading:boolean
    },
    filter: {
        loading: boolean;
        error: string | null;
        tags: number[];
        input: string;
    }
}

export default RootState;