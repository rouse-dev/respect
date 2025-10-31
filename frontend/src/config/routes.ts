import EditPanel from "../components/Edit/edit_panel";
import { Debt } from "../pages/Debt";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";

interface RouteInterface {
  name: string,
  path: string,
  component: (() => JSX.Element)
}
// guest
export const GuestRoutes: RouteInterface[] = [
  {
    name: "Авторизация",
    path: "/login",
    component: Login,
  },
];
// teacher
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
  {
    name: 'Панель управления',
    path: "/edit",
    component: EditPanel
  },
  {
    name:'Заявки',
    path:'/debt',
    component: Debt
  }
];
// admin
export const AdminRoutes:RouteInterface[] = [
  {
    name:"Админ панель",
    path:"/admin/panel",
    component: EditPanel
  }
]

// student

// export const StudentRoutes:RouteInterface[] = [
//   {
//     name:"Главная",
//     path:'/home',
//     component:
//   }
// ]