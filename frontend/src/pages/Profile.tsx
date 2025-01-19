import { useState } from "react";
import placeholder_avatar from '../assets/media/placeholder_avatar.png';
import { Link } from "react-router-dom";

const Profile = () => {
    const [user, setUser] = useState({
        username: '',
        avatar: ''
    });

    return (
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-5 text-lg p-3 sm:p-5 text-white">
            <Link className="flex flex-row justify-self-end w-full sm:w-fit justify-center items-center sm:ml-auto mb-3 sm:mb-12 px-3 py-2 rounded-lg gap-4 bg-[--respect-purple-deep]" to='/'>На главную</Link>
            <div className="flex flex-col items-center gap-3 border-4 border-[--respect-purple-dark] w-full max-w-md p-5 bg-[--respect-purple-deep] rounded-lg">
                <img className="max-w-28 max-h-28 w-full h-full rounded-[100%]" src={user.avatar ? `http://localhost:0000/some_folder/${user.avatar}` : placeholder_avatar} />
                <input className="hidden" type="file" id="avatar_file" accept="image/*" />
                <button className="bg-[--respect-purple-dark] mb-2 px-3 py-2 rounded-lg" onClick={e => {
                    const input :HTMLElement = e.currentTarget.parentElement!.querySelector('input[type=file]') as HTMLElement;
                    input.click();
                }}>Загрузить файл</button>

                <input className="border-4 border-[--respect-purple-dark] bg-transparent w-full px-3 py-2 rounded-lg outline-none" placeholder="Имя" type="text" required />
                <input className="border-4 border-[--respect-purple-dark] bg-transparent w-full px-3 py-2 rounded-lg outline-none" placeholder="Эл. почта" type="email" required />
                <input className="border-4 border-[--respect-purple-dark] bg-transparent w-full px-3 py-2 rounded-lg outline-none" placeholder="Пароль" type="password" required />

                <button className="bg-[--respect-purple-dark] w-full mt-2 px-2 py-4 rounded-lg">Сохранить изменения</button>
            </div>
        </div>
    )
}

export default Profile;