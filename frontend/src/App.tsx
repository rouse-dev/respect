import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthRoutes } from "./config/routes";
import Login from "./pages/login";

function App() {
  return (
    <AppProvider>
      <Routes>
      {AuthRoutes.map((el, i) => <Route key={i} path={el.path} Component={el.component} />)}
      <Route path="/login" Component={Login} />
      </Routes>
    </AppProvider>
  );
}

export default App;
