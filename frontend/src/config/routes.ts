import Home from "../components/pages/home";
import Profile from "../components/pages/profile";

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