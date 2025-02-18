import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AppProvider } from "./store/AppContext";
import { AuthRoutes, GuestRoutes } from "./config/routes";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import useUserStore from "./store/userStore";
import { useEffect } from "react";

const App = () => {
  const {auth} = useUserStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    !auth && AuthRoutes.find(el => el.path === window.location.pathname) && navigate('/login');
    auth && GuestRoutes.find(el => el.path === window.location.pathname) && navigate('/');
  }, [auth, window.location.pathname]);
  return (
    <AppProvider>
      <Routes>
      {!auth && <Route path="*" element={<Navigate to="/login" replace />} />}
        {auth
          ? AuthRoutes.map((el, i) => (
              <Route key={i} path={el.path} Component={el.component} />
            ))
          : GuestRoutes.map((el, i) => (
              <Route key={i} path={el.path} Component={el.component} />
            ))}

        <Route path="/login" Component={Login} />
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
    </AppProvider>
  );
};

export default App;
