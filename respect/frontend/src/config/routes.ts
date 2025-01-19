import Auth from "../components/pages/auth";
import Home from "../components/pages/home";
import Profile from "../components/pages/profile";

export const GuestRoutes: Array<any> = [
    {
        name: 'Авторизация',
        path: '/',
        component: Auth
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