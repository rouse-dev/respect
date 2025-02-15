import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";

interface RouteInterface {
  name: string,
  path: string,
  component: (() => JSX.Element)
}

export const GuestRoutes: RouteInterface[] = [
  {
    name: "Авторизация",
    path: "/login",
    component: Login,
  },
];

export const AuthRoutes: RouteInterface[] = [
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
