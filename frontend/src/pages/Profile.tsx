import { useEffect, useState } from "react";
import placeholder_avatar from '../assets/media/placeholder_avatar.png'
import { Link } from "react-router-dom";
import userStore from "../store/userStore";

const Profile = () => {
    const [user, setUser] = useState({
        username: '',
        avatar: ''
    });

    const handleLogout = () => {
        userStore.logoutUser();
    }

    return (
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-5 text-lg p-3 sm:p-5 text-white">
            <div className="w-full flex flex-row justify-between sm:mb-12">
                <button className="hidden sm:block w-full sm:w-fit px-3 py-2 rounded-lg bg-[--respect-purple-deep]" onClick={handleLogout}>Выход</button>
                <Link className="w-full sm:w-fit px-3 py-2 rounded-lg bg-[--respect-purple-deep]" to='/'>На главную</Link>
            </div>
            
            <div className="flex flex-col items-center gap-3 w-full sm:max-w-md p-5 bg-[--respect-purple-deep] rounded-lg">
                <img className="max-w-28 max-h-28 w-full h-full rounded-[100%]" src={user.avatar ? `http://localhost:0000/some_folder/${user.avatar}` : placeholder_avatar} />
                <input className="hidden" type="file" id="avatar_file" accept="image/*" />
                <button className="bg-[--respect-purple-dark] mb-2 px-3 py-2 rounded-lg" onClick={e => {
                    const input :HTMLElement = e.currentTarget.parentElement!.querySelector('input[type=file]') as HTMLElement;
                    input.click();
                }}>Загрузить файл</button>

                <input className="bg-[--respect-purple-light] w-full px-3 py-2 rounded-lg outline-none" placeholder="Имя" type="text" required />
                <input className="bg-[--respect-purple-light] w-full px-3 py-2 rounded-lg outline-none" placeholder="Эл. почта" type="email" required />
                <input className="bg-[--respect-purple-light] w-full px-3 py-2 rounded-lg outline-none" placeholder="Пароль" type="password" required />

                <button className="bg-[--respect-purple-dark] w-full mt-2 px-2 py-4 rounded-lg">Сохранить изменения</button>
            </div>

        </div>
    )
}

export default Profile;