import {
  FaEdit,
  FaTrashAlt,
  FaSave,
  FaAngleDown,
  FaAngleUp,
  FaRegPlusSquare,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { TbCancel } from "react-icons/tb";
import { toast } from "react-toastify";
import Preloader from "../common/preloader/preloader";
import role from "../../types/role";
import { getAllUsers, updateUserById, deleteUserById } from "../../service/admin";
import AddUsers from "../common/popups/addPopups/add_users";
import usePopupStore from "../../store/popupStore";

interface EditUsersInterface {
  isOpen: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: role;
  avatar?: string;
}

const EditUsers = ({ isOpen }: EditUsersInterface) => {
  const { setPopupActive } = usePopupStore();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<role>("");
  const [newPassword, setNewPassword] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [isAddUsersPopup, setIsAddUsersPopup] = useState(false);

  const roles: role[] = ["admin", "teacher"];

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setNewName(user.name);
    setNewEmail(user.email);
    setNewRole(user.role);
    setNewPassword("");
  };

  const handleSave = async (id: number) => {
    if (!newName.trim() || !newEmail.trim() || !newRole) {
      toast.error("Заполните все обязательные поля!");
      return;
    }

    const updateData: any = {
      idUser: id,
      name: newName,
      email: newEmail,
      role: newRole,
    };

    if (newPassword) {
      updateData.password = newPassword;
    }

    try {
      const response = await updateUserById(updateData);
      if (!response.error) {
        const updatedUsers = users.map((user) =>
          user.id === id
            ? { ...user, name: newName, email: newEmail, role: newRole }
            : user
        );
        setUsers(updatedUsers);
        setSortedUsers(updatedUsers);
        setEditingId(null);
        setNewPassword("");
        toast.success("Пользователь успешно обновлен!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при обновлении пользователя");
    }
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      try {
        await deleteUserById(userId);
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
        setSortedUsers(updatedUsers);
        toast.success("Пользователь успешно удален!");
      } catch (error) {
        console.error(error);
        toast.error("Ошибка при удалении пользователя");
      }
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      if (response && !response.error && response.data) {
        const usersData: User[] = response.data;
        setUsers(usersData);
        setSortedUsers(usersData);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при загрузке пользователей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (search.length > 0) {
      setSortedUsers(
        [...users].filter(
          (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setSortedUsers([...users]);
    }
  }, [users, search]);

  if (!isOpen) return null;

  return (
    <>
      {loading && <Preloader />}
      <div
        className={`${
          isOpen ? "max-w-full px-3 sm:px-5" : "max-w-0 max-h-0"
        } overflow-hidden transition-[max-width_max-height] py-3 sm:py-5 w-full flex flex-col gap-5 text-lg bg-[--respect-purple-deep] rounded-md`}
      >
        <input
          className={`placeholder:text-[#8e8e8e] outline-none w-full bg-[--respect-purple-dark] rounded-lg py-2 pl-3 pr-9 outline-hidden ${
            search.length
              ? "bg-[url(./assets/media/lypa-white.svg)]"
              : "bg-[url(./assets/media/lypa-grey.svg)]"
          } bg-no-repeat bg-[calc(100%-8px)_center] bg-[24px_auto]`}
          placeholder="Поиск по имени или email..."
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <button
          onClick={() => {
            setIsAddUsersPopup(true);
            setPopupActive(true);
          }}
          className="flex flex-row justify-center items-center gap-3 p-3 bg-[--respect-purple-dark] rounded-md transition-shadow hover:shadow-[0px_0px_5px_var(--respect-purple-light)]"
        >
          <p className="hidden sm:block">Создать</p>
          <FaRegPlusSquare />
        </button>

        {sortedUsers.map((user) => (
          <div
            key={user.id}
            className={`${
              isOpen ? "scale-y-100" : "scale-y-0"
            } transition-transform flex flex-col md:flex-row justify-between items-center gap-3 p-3 bg-[--respect-purple] rounded-md text-xl`}
          >
            {editingId === user.id ? (
              <div className="flex flex-col sm:flex-row gap-3 w-full z-50">
                <input
                  className="flex-1 bg-[--respect-purple-add-inputs] rounded-lg py-2 pl-3 outline-none"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Имя пользователя"
                />
                <input
                  className="flex-1 bg-[--respect-purple-add-inputs] rounded-lg py-2 pl-3 outline-none"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Email"
                />
                <div className="relative z-60">
                  <div 
                    className="relative cursor-pointer selection:bg-transparent flex flex-row justify-end items-center px-4 py-2 rounded-t-lg rounded-b-lg gap-5 bg-[--respect-purple-dark]" 
                    onClick={e => {
                      const dropdownElement = e.currentTarget;
                      dropdownElement.classList.toggle('rounded-b-lg');
                      
                      setDropdown(dropdownElement.querySelector("div")!.classList.contains("hidden"));
                      dropdownElement.querySelector('div')!.classList.contains('hidden') ?
                      dropdownElement.querySelector('div')!.classList.replace('hidden', 'flex') :
                      dropdownElement.querySelector('div')!.classList.replace('flex', 'hidden');
                    }}
                  >
                    <p className="flex mr-auto z-50">{newRole || 'Роль'}</p>
                    <p className="hidden sm:block">|</p>
                    {dropdown ? <FaAngleUp /> : <FaAngleDown />}

                    <div className="hidden z-70 flex-col absolute left-0 top-full w-full max-h-64 overflow-y-scroll overflow-x-hidden rounded-b-lg border-[6px] border-t-0 border-[--respect-purple-dark] bg-[--respect-purple]">
                      {roles.map((roleOption) => (
                        <button 
                          type="button" 
                          className="px-3 py-2 text-left hover:backdrop-brightness-110 last:rounded-b-sm" 
                          key={roleOption} 
                          onClick={() => {
                            setNewRole(roleOption);
                            setDropdown(false);
                          }}
                        >
                          {roleOption}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <input
                  className="flex-1 bg-[--respect-purple-add-inputs] rounded-lg py-2 pl-3 outline-none"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Новый пароль (необязательно)"
                />
              </div>
            ) : (
              <div className="flex flex-row items-center gap-3">
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-sm text-gray-300">{user.email}</span>
                  <span className="text-xs text-gray-400 capitalize">{user.role}</span>
                </div>
              </div>
            )}

            <div className="flex flex-row items-center gap-2">
              {editingId === user.id ? (
                <>
                  <button
                    onClick={() => handleSave(user.id)}
                    className="p-3 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                    title="Сохранить"
                  >
                    <FaSave />
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setNewPassword("");
                    }}
                    className="p-3 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
                    title="Отменить"
                  >
                    <TbCancel />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-3 bg-amber-600 hover:bg-amber-500 rounded-md transition-colors"
                    title="Редактировать"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-3 bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                    title="Удалить"
                  >
                    <FaTrashAlt />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {sortedUsers.length === 0 && !loading && (
          <div className="text-center text-gray-400 py-8">
            {search ? "Пользователи не найдены" : "Нет пользователей"}
          </div>
        )}
        
        <AddUsers
          isOpen={isAddUsersPopup}
          onClose={() => {
            setIsAddUsersPopup(false);
            setPopupActive(false);
          }}
          onUserAdded={(newUser) => {
            const updatedUsers = [...users, newUser];
            setUsers(updatedUsers);
            setSortedUsers(updatedUsers);
          }}
        />
      </div>
    </>
  );
};

export default EditUsers;