import Home from "../pages/home";
import Profile from "../pages/profile";

export const GuestRoutes: Array<any> = [
    {
        name: 'Регистрация',
        path: '/signup',
        component: null
    },
    {
        name: 'Авторизация',
        path: '/login',
        component: null
    },
];

export const AuthRoutes: Array<any> = [
    {
        name: 'Главная',
        path: '/',
        component: Home
    },
    {
        name: 'Профиль',
        path: '/profile',
        component: Profile
    },
];