import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userStore from "../store/userStore";
import { observer } from "mobx-react-lite";

const Login = observer(() => {
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
    <div className="flex flex-col justify-center items-center bg-[--respect-purple] w-full h-[100vh] p-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-3 w-full max-w-80 p-5 bg-[--respect-purple-deep] rounded-lg text-white"
      >
        <p className="text-3xl font-bold text-center mb-2">Вход</p>

        <input
          className="bg-[--respect-purple-light] w-full px-3 py-2 rounded-lg outline-none"
          placeholder="Эл. почта"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="bg-[--respect-purple-light] w-full px-3 py-2 rounded-lg outline-none"
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-[--respect-purple-dark] w-full mt-2 px-2 py-4 rounded-lg"
        >
          Войти
        </button>
      </form>
    </div>
  );
});

export default Login;
