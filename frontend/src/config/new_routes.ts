import { FC } from "react";
import Profile from "../pages/Profile";
import { Debt } from "../pages/Debt";
import Journal from "../pages/Journal";
import role from "../types/role";
import Login from "../pages/Login";
import Edit from "../pages/Edit";

interface IAppRoute {
  name: string;
  path: string;
  component: FC;
  roles: role[] | "*";
}

const AppRoutes: IAppRoute[] = [
    {
        name: "Авторизация",
        path: "/login",
        component: Login,
        roles: ['']
    },
    {
        name: "Журнал",
        path: "/journal",
        component: Journal,
        roles: ['teacher']
    },
    {
        name: "Профиль",
        path: "/profile",
        component: Profile,
        roles: ['admin', 'student', 'teacher']
    },
    {
        name: "Панель управления",
        path: "/edit",
        component: Edit,
        roles: ['admin']
    },
    {
        name: "Заявки",
        path: "/debt",
        component: Debt,
        roles: ['teacher']
    },
];

export default AppRoutes;