import { Link } from "react-router-dom";
import AvatarContainer from "./AvatarContainer";
import { IoMdExit } from "react-icons/io";
import { ImUndo2 } from "react-icons/im";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { DebtHistoryContainer } from "./DebtHistory/DebtHistoryContainer";
import { ChangeTeacherAvatar, ChangeTeacherInfo } from "../../service/auth";
import { UserStoreInterface } from "../../store/userStore";

interface ProfileInterface {
    handleLogout: () => void,
    useUserStore: UserStoreInterface
}

const Profile = ({ handleLogout, useUserStore }: ProfileInterface) => {
    const [changes, setChanges] = useState({
        name: useUserStore.name,
        email: useUserStore.email,
        password: '',
        oldPassword: ''
    });
    const [avatar, setAvatar] = useState<File | null>(null);
    const passRef = useRef<HTMLInputElement | null>(null);
    const oldPassRef = useRef<HTMLInputElement | null>(null);

    return (
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-5 text-lg p-3 sm:p-5 text-white">
            <div className="w-full flex flex-row justify-between sm:mb-12">
                <button className="hidden sm:flex flex-row items-center justify-center gap-2 w-full sm:w-fit px-3 py-2 rounded-lg bg-[--respect-purple-deep] cursor-pointer" onClick={handleLogout}>Выход <IoMdExit /></button>
                {useUserStore.role !== "student" &&  <Link className="flex flex-row items-center justify-center gap-2 w-full text-center sm:w-fit px-3 py-2 rounded-lg bg-[--respect-purple-deep]" to='/journal'>На главную <ImUndo2 /></Link>}
            </div>
            <div className="w-full flex justify-between gap-7">
                <div className="w-full mx-auto flex flex-col items-center gap-3 sm:max-w-md p-5 bg-[--respect-purple-deep] rounded-lg">
                <AvatarContainer useUserStore={useUserStore} setAvatar={setAvatar} />
                <input className="bg-[--respect-purple-light] w-full px-3 py-2 rounded-lg outline-hidden" placeholder="Имя" type="text" defaultValue={useUserStore.name} required onChange={e => setChanges(prev => ({...prev, name: e.target.value}))} />
                <input className="bg-[--respect-purple-light] w-full px-3 py-2 rounded-lg outline-hidden" placeholder="Эл. почта" type="email" defaultValue={useUserStore.email} required onChange={e => setChanges(prev => ({...prev, email: e.target.value}))} />
                <input ref={oldPassRef} className="bg-[--respect-purple-light] w-full px-3 py-2 rounded-lg outline-hidden" placeholder="Текущий пароль" type="password" required onChange={e => setChanges(prev => ({...prev, oldPassword: e.target.value}))} />
                <input ref={passRef} className="bg-[--respect-purple-light] w-full px-3 py-2 rounded-lg outline-hidden" placeholder="Новый пароль" type="password" required onChange={e => setChanges(prev => ({...prev, password: e.target.value}))} />

                <button className="bg-[--respect-purple-dark] w-full mt-2 px-2 py-4 rounded-lg transition-colors disabled:text-gray-400" disabled={(changes.name === useUserStore.name) && (changes.email === useUserStore.email) && (changes.password === useUserStore.password) && (avatar === null) } onClick={_ => {
                    const AvatarForm = new FormData();
                    avatar && AvatarForm.append('avatar', avatar);

                    const Changed = {oldPassword: changes.oldPassword};
                    (changes.name != useUserStore.name && changes.name.length > 0) && Object.assign(Changed, {name: changes.name});
                    (changes.email != useUserStore.email && changes.email.length > 0) && Object.assign(Changed, {email: changes.email});
                    (changes.password != useUserStore.password && changes.password.length > 0) && Object.assign(Changed, {password: changes.password});
                    if (!avatar && Object.keys(Changed).length === 0) {
                        toast.error('Изменения отсутствуют!');
                    } else {
                        avatar && ChangeTeacherAvatar(AvatarForm).then(_ => {
                            useUserStore.CheckAuth();
                            if (!passRef.current || !oldPassRef.current) return;
                            passRef.current.value = '';
                            oldPassRef.current.value = '';
                        });
                        (Object.keys(Changed).length > 0) && ChangeTeacherInfo(Changed).then(_ => {
                            useUserStore.CheckAuth();
                            if (!passRef.current || !oldPassRef.current) return;
                            passRef.current.value = '';
                            oldPassRef.current.value = '';
                        });
                    }
                }}>Сохранить изменения</button>
                </div>
                {useUserStore.role === 'teacher' && <DebtHistoryContainer/>}
                {useUserStore.role === 'student' && <DebtHistoryContainer/>}
            </div>
           
           
            <button className="flex sm:hidden flex-row items-center justify-center gap-2 w-full sm:w-fit px-3 py-2 rounded-lg bg-[--respect-purple-deep] cursor-pointer" onClick={handleLogout}>Выход <IoMdExit /></button> 
           
        </div>
    )
}

export default Profile;