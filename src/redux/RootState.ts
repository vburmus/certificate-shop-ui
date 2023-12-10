import {User} from "../utils/types";

interface RootState {
    user: {
        loading: boolean;
        user: User | null;
        error: string | null;
    },
    filter: {
        loading: boolean;
        error: string | null;
        tags: number[];
        input: string;
    }
}

export default RootState;