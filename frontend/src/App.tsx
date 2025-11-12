import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useUserStore from "./store/userStore";
import { useEffect } from "react";
import usePopupStore from "./store/popupStore";
import AppRoutes from "./config/new_routes";

const App = () => {
  const {auth, role} = useUserStore();
  const navigate = useNavigate();
  const { popupActive } = usePopupStore();

  useEffect(() => {
    document.body.style.setProperty('overflow', popupActive ? "hidden" : "");
  }, [popupActive]);

  // useEffect(() => {
  //   !auth && AuthRoutes.find(el => el.path === window.location.pathname) && navigate('/login');
  //   auth && GuestRoutes.find(el => el.path === window.location.pathname) && navigate('/');
  // }, [auth, window.location.pathname]);

  useEffect(() => {
    const route = AppRoutes.filter(route => route.roles === '*' || route.roles.includes(role)).find(route => route.path === window.location.pathname);

    console.log(route)
    console.log(role)

    if (!route) {
      switch (role) {
        case 'admin': { navigate('/edit'); break; }
        case 'teacher': { navigate('/journal'); break; }
        case 'student': { navigate('/profile'); break; }
        default: navigate('/login')
      }
      return;
    };

    if (route.roles === '*') return;

    if (!route.roles.includes(role)) {
      switch (role) {
        case 'admin': { navigate('/edit'); break; }
        case 'teacher': { navigate('/journal'); break; }
        case 'student': { navigate('/profile'); break; }
      }
    }
  }, [auth, role, window.location.pathname]);

  return (
    <>
      <Routes>
      {/* {!auth && <Route path="*" element={<Navigate to="/login" replace />} />}
        {auth
          ? AuthRoutes.map((el, i) => (
              <Route key={i} path={el.path} Component={el.component} />
            ))
          : GuestRoutes.map((el, i) => (
              <Route key={i} path={el.path} Component={el.component} />
            ))} */}

        {AppRoutes.filter(route => route.roles === '*' || route.roles.includes(role)).map((el, i) => <Route key={i} path={el.path} Component={el.component} />)}
        
      </Routes>
      <ToastContainer 
        draggable
        autoClose={1700}
        closeButton={false}
        pauseOnHover={false}
        closeOnClick={true}
        stacked={true}
        position={"top-center"}
        draggableDirection={"y"}
        toastClassName={"toastClassName"}
        progressClassName={"progressClassName"}
        style={{boxShadow:'0px 0px 20px var(--respect-purple-dark)'}}/>
    </>
  );
};

export default App;
