import { Route, Routes } from "react-router-dom"
import { AuthRoutes } from "./config/routes"

const App = () => {
  return (
    <Routes>
      {AuthRoutes.map((el, i) => <Route key={i} path={el.path} Component={el.component} />)}
    </Routes>
  )
}

export default App