import { create } from "zustand";
import client from "../service/client";
import { toast } from "react-toastify";
import role from "../types/role";

interface UserLoginInterface {
    email: string,
    password: string,
}

export interface UserStoreInterface {
    auth: boolean,
    name: string,
    email: string,
    password: string,
    avatar: string,
    role: role,
    LoginUser: (data: UserLoginInterface) => void,
    CheckAuth: () => void,
    LogoutUser: () => void
}

interface GetResponseInterface {
    auth: boolean,
    name: string,
    email: string,
    avatar: string,
    role: role,
}

const TryGetUser = async () => {
    const response = await client.get<GetResponseInterface>('/api/auth/me').then(res => res).catch(_ => Object());
    console.log(response)
    return {
        auth: Object.keys(response).length > 0,
        name: response.data ? response.data.name : '',
        email: response.data ? response.data.email : '',
        password: response.data ? response.data.password : '',
        avatar: response.data ? response.data.avatar : '',
        role: response.data ? response.data.role : '',
    };
}

const useUserStore = create<UserStoreInterface>()((set) => {
    const userData: UserStoreInterface = {
        auth: false,
        name: '',
        email: '',
        password: '',
        avatar: '',
        role: '',
        LoginUser: (data: UserLoginInterface) => {
            client.post('/api/auth/login', data).then(ss => {
                console.log(ss)
                TryGetUser().then(res => {
                    console.log(res)
                    set(res);
                    toast.success(`Добро пожаловать, ${res.name}!`);
                })
            }).catch(_ => toast.error('Неправильный логин или пароль!'))
        },
        CheckAuth: () => {
            TryGetUser().then(res => set(res));
        },
        LogoutUser: () => {
            client.post('/api/auth/logout').then(_ => {
                TryGetUser().then(res => set(res));
                toast.info('До свидания!')
            });
        }
    };

    TryGetUser().then(res => set(res));

    return userData;
});

export default useUserStore;