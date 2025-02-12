import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userStore from "../../store/userStore";
import Login from "./Login";

const LoginContainer = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await userStore.authUser({ email, password });
    if (userStore.isAuth) {
      navigate("/");
    }
  };
  return (
    <Login
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};

export default LoginContainer;
