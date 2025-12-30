import { Profile } from "@/types/auth";

export const INITIAL_LOGIN_FORM = {
    email: '',
    password: '',
};


export const INITIAL_STATE_LOGIN_FORM = {
    status: 'idle',
    errors: {
        email: [],
        password: [],
        _form: [],
    }
}


export const INITIAL_PROFILE: Profile = {
    id: '',
    name: '',
    role: '',
    avatar_url: ''
}