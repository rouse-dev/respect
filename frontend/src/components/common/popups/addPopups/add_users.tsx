import { useState } from "react";
import Preloader from "../../preloader/preloader";
import { toast } from "react-toastify";
import { createUser } from "../../../../service/admin";
import role from "../../../../types/role";

interface AddUsersProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (newUser: any) => void;
}

const AddUsers = ({ isOpen, onClose, onUserAdded }: AddUsersProps) => {
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createRole, setCreateRole] = useState<role>("admin");
  const [createLessonsIds, setCreateLessonsIds] = useState<number[]>([]);
  const [createDropdown, setCreateDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const roles: role[] = ["admin", "teacher"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createName.trim() || !createEmail.trim() || !createPassword.trim() || !createRole) {
      toast.error("Заполните все обязательные поля!");
      return;
    }

    const userData = {
      email: createEmail,
      password: createPassword,
      name: createName,
      role: createRole,
      ...(createRole === "teacher" && { lessonsIds: createLessonsIds }),
    };

    try {
      setLoading(true);
      const response = await createUser(userData);
      if (response.success && response.data) {
        const newUser = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          avatar: response.data.avatar,
        };
        
        onUserAdded(newUser);
        
        // Reset form
        setCreateName("");
        setCreateEmail("");
        setCreatePassword("");
        setCreateRole("admin");
        setCreateLessonsIds([]);
        onClose();
        toast.success("Пользователь успешно создан!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при создании пользователя");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col justify-center items-center w-full h-[100vh] fixed top-0 left-0 z-50 backdrop-blur">
      {loading ? (
        <Preloader />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-[300px] bg-[--respect-purple-deep] flex flex-col items-center justify-center p-5 rounded-lg gap-3"
        >
          <input
            className="sm:max-w-xs w-full bg-[--respect-purple-add-inputs] rounded-lg py-2 pl-3 outline-hidden"
            placeholder="Имя пользователя"
            type="text"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
          />
          
          <input
            className="sm:max-w-xs w-full bg-[--respect-purple-add-inputs] rounded-lg py-2 pl-3 outline-hidden"
            placeholder="Email"
            type="email"
            value={createEmail}
            onChange={(e) => setCreateEmail(e.target.value)}
          />
          
          <input
            className="sm:max-w-xs w-full bg-[--respect-purple-add-inputs] rounded-lg py-2 pl-3 outline-hidden"
            placeholder="Пароль"
            type="password"
            value={createPassword}
            onChange={(e) => setCreatePassword(e.target.value)}
          />
          
          <div>
            <div 
              className="relative cursor-pointer selection:bg-transparent flex flex-row justify-end items-center px-4 py-2 rounded-t-lg rounded-b-lg gap-5 bg-[--respect-purple-dark]" 
              onClick={e => {
                const dropdown = e.currentTarget;
                dropdown.classList.toggle('rounded-b-lg');
                
                setCreateDropdown(dropdown.querySelector("div")!.classList.contains("hidden"));
                dropdown.querySelector('div')!.classList.contains('hidden') ?
                dropdown.querySelector('div')!.classList.replace('hidden', 'flex') :
                dropdown.querySelector('div')!.classList.replace('flex', 'hidden');
              }}
            >
              <p className="flex mr-auto">{createRole || 'Роль'}</p>
              <p className="hidden sm:block">|</p>
              {createDropdown ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              )}

              <div className="hidden z-20 flex-col absolute left-0 top-full w-full max-h-64 overflow-y-scroll overflow-x-hidden rounded-b-lg border-[6px] border-t-0 border-[--respect-purple-dark] bg-[--respect-purple]">
                {roles.map((roleOption) => (
                  <button 
                    type="button" 
                    className="px-3 py-2 text-left hover:backdrop-brightness-110 last:rounded-b-sm" 
                    key={roleOption} 
                    onClick={() => {
                      setCreateRole(roleOption);
                      setCreateLessonsIds([]);
                    }}
                  >
                    {roleOption}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {createRole === "teacher" && (
            <div className="text-sm text-gray-300 w-full text-center">
              <p>Предметы будут добавлены после создания пользователя</p>
            </div>
          )}
          
          <button 
            type="submit"
            disabled={loading}
            className="h-[40px] bg-[--respect-purple-dark] w-full flex items-center justify-center rounded-lg cursor-pointer disabled:opacity-50"
          >
            Создать
          </button>
          <button 
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-[40px] bg-[--respect-purple-dark] w-full flex items-center justify-center rounded-lg cursor-pointer disabled:opacity-50"
          >
            Отмена
          </button>
        </form>
      )}
    </div>
  );
};

export default AddUsers;