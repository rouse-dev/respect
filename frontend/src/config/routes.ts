import Home from "../pages/home";
import Login from "../pages/login";
import Profile from "../pages/profile";

export const GuestRoutes: Array<any> = [
  {
    name: "Авторизация",
    path: "/login",
    component: Login,
  },
];

export const AuthRoutes: Array<any> = [
  {
    name: "Главная",
    path: "/",
    component: Home,
  },
  {
    name: "Профиль",
    path: "/profile",
    component: Profile,
  },
];
