

const Auth = () =>{
    return(
        <>
        <div className="max-w-6xl mx-auto flex flex-col h-screen items-center justify-center gap-5 text-lg p-3 sm:p-5 text-white">
            
            <div className="flex flex-col items-center gap-3 border-4 border-[--respect-purple-dark] w-full max-w-md p-5 bg-[--respect-purple-deep] rounded-lg">

                <h2 className="text-4xl font-bold mb-5">Авторизация</h2>

                <input className="border-4 border-[--respect-purple-dark] bg-transparent w-full px-3 py-2 rounded-lg outline-none" placeholder="Эл. почта" type="email" required />
                <input className="border-4 border-[--respect-purple-dark] bg-transparent w-full px-3 py-2 rounded-lg outline-none" placeholder="Пароль" type="password" required />

                <button className="bg-[--respect-purple-dark] w-full mt-2 px-2 py-4 rounded-lg">Авторизоваться</button>
                
            </div>
        </div>
        
        </>
    )
}

export default Auth