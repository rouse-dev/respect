import { Link } from "react-router-dom";
import AvatarContainer from "./AvatarContainer";
import { IoMdExit } from "react-icons/io";
import { ImUndo2 } from "react-icons/im";

interface useUserStoreInterface {
    auth: boolean,
    name: string,
    email: string,
    avatar: string
}
interface ProfileInterface {
    handleLogout: () => void,
    useUserStore: useUserStoreInterface,
    placeholder_avatar: string,
}

const Profile = ({ handleLogout, useUserStore, placeholder_avatar }: ProfileInterface) => {
    return (
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-5 text-lg p-3 sm:p-5 text-white">
            <div className="w-full flex flex-row justify-between sm:mb-12">
                <button className="hidden sm:flex flex-row items-center justify-center gap-2 w-full sm:w-fit px-3 py-2 rounded-lg bg-(--respect-purple-deep)" onClick={handleLogout}>Выход <IoMdExit /></button>
                <Link className="flex flex-row items-center justify-center gap-2 w-full text-center sm:w-fit px-3 py-2 rounded-lg bg-(--respect-purple-deep)" to='/'>На главную <ImUndo2 /></Link>
            </div>
            <div className="flex flex-col items-center gap-3 w-full sm:max-w-md p-5 bg-(--respect-purple-deep) rounded-lg">
                <AvatarContainer useUserStore={useUserStore} placeholder_avatar={placeholder_avatar} />

                <input className="bg-(--respect-purple-light) w-full px-3 py-2 rounded-lg outline-hidden" placeholder="Имя" type="text" required />
                <input className="bg-(--respect-purple-light) w-full px-3 py-2 rounded-lg outline-hidden" placeholder="Эл. почта" type="email" required />
                <input className="bg-(--respect-purple-light) w-full px-3 py-2 rounded-lg outline-hidden" placeholder="Пароль" type="password" required />

                <button className="bg-(--respect-purple-dark) w-full mt-2 px-2 py-4 rounded-lg">Сохранить изменения</button>
            </div>
            <button className="flex sm:hidden flex-row items-center justify-center gap-2 w-full sm:w-fit px-3 py-2 rounded-lg bg-(--respect-purple-deep)" onClick={handleLogout}>Выход <IoMdExit /></button>
        </div>
    )
}

export default Profile;