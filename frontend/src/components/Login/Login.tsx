import apt from '../../assets/media/apt.png'

interface LoginInterface {
  handleSubmit: (arg: React.FormEvent) => void;
  email: string;
  setEmail: (arg: string) => void;
  password: string;
  setPassword: (arg: string) => void;
}

const Login = ({  handleSubmit, email, setEmail, password, setPassword }: LoginInterface) => {
  return (
    <div className="flex gap-6 flex-col justify-center items-center bg-[--respect-purple] w-full h-[100vh] p-5">
      <img className='w-full max-w-32' src={apt} />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-3 w-full max-w-80 p-5 bg-[--respect-purple-deep] rounded-lg text-white"
      >
        <p className="text-3xl font-bold text-center mb-2">Вход</p>

        <input
          className="bg-[--respect-purple-light] w-full px-3 py-2 rounded-lg outline-hidden"
          placeholder="Эл. почта"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="bg-[--respect-purple-light] w-full px-3 py-2 rounded-lg outline-hidden"
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-[--respect-purple-dark] w-full mt-2 px-2 py-4 rounded-lg cursor-pointer hover:opacity-80"
        >
          Войти
        </button>
      </form>
    </div>
  );
};

export default Login;
