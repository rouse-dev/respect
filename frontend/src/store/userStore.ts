import { create } from "zustand";
import client from "../service/client";
import { toast } from "react-toastify";

interface UserLoginInterface {
    email: string,
    password: string,
}

interface UserStoreInterface {
    auth: boolean,
    name: string,
    email: string,
    avatar: string,
    LoginUser: (data: UserLoginInterface) => void,
    CheckAuth: () => void,
    LogoutUser: () => void
}

interface GetResponseInterface {
    auth: boolean,
    name: string,
    email: string,
    avatar: string
}

const TryGetUser = async () => {
    const response = await client.get<GetResponseInterface>('/api/teachers/me').then(res => res).catch(_ => Object());
    return {
        auth: Object.keys(response).length > 0,
        name: response.data ? response.data.name : '',
        email: response.data ? response.data.email : '',
        avatar: response.data ? response.data.avata : ''
    };
}

const useUserStore = create<UserStoreInterface>()((set) => {
    const userData = {
        auth: false,
        name: '',
        email: '',
        avatar: '',
        LoginUser: (data: UserLoginInterface) => {
            client.post('/api/teachers/login', data).then(_ => {
                TryGetUser().then(res => {
                    set(res);
                    toast.success(`Добро пожаловать, ${res.name}!`);
                })
            }).catch(_ => toast.error('Неправильный логин или пароль!'))
        },
        CheckAuth: () => {
            TryGetUser().then(res => set(res));
        },
        LogoutUser: () => {
            client.post('/api/teachers/logout').then(_ => {
                TryGetUser().then(res => set(res));
                toast.info('До свидания!')
            });
        }
    };

    TryGetUser().then(res => set(res));

    return userData;
});

export default useUserStore;