import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./store/AppContext";
import { AuthRoutes, GuestRoutes } from "./config/routes";
import { observer } from "mobx-react-lite";
import userStore from "./store/userStore";
import Login from "./pages/login";

const App = observer(() => {
  const auth = userStore.isAuth;
  console.log(auth);
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
    </AppProvider>
  );
});

export default App;
