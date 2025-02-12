import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";

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
