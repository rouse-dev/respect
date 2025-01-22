const Login = () => {
    return (
        <div className="flex flex-col justify-center items-center bg-[--respect-purple] w-full h-[100vh] p-5">
            <div className="flex flex-col items-center gap-3 w-full max-w-80 p-5 bg-[--respect-purple-deep] rounded-lg text-white">
                <p className="text-3xl font-bold text-center mb-2">Вход</p>

                <input className="bg-[--respect-purple-light] w-full px-3 py-2 rounded-lg outline-none" placeholder="Эл. почта" type="email" required />
                <input className="bg-[--respect-purple-light] w-full px-3 py-2 rounded-lg outline-none" placeholder="Пароль" type="password" required />

                <button className="bg-[--respect-purple-dark] w-full mt-2 px-2 py-4 rounded-lg">Войти</button>
            </div>
        </div>
    )
}

export default Login;