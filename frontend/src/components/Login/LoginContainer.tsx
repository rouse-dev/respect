import { useState } from "react";
import Login from "./Login";
import useUserStore from "../../store/userStore";

const LoginContainer = () => {
  const {LoginUser} = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    LoginUser({email, password});
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
