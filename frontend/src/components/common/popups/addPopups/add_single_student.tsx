import { useState, useEffect } from "react";
import Preloader from "../../preloader/preloader";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { toast } from "react-toastify";
import useStudentStore from "../../../../store/studentStore";
import useGroupStore from "../../../../store/groupStore";
import usePopupStore from "../../../../store/popupStore";
import { Group } from "../../../../interfaces/group";
import { AddStudentSingle, GetAllGroups } from "../../../../service/admin";

interface SingleStudentPopupInterface {
  onClose: () => void;
  isOpen: boolean;
}

const SingleStudentPopup = ({ onClose, isOpen }: SingleStudentPopupInterface) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [studentName, setStudentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedCredentials, setGeneratedCredentials] = useState<{email: string, password: string} | null>(null);
  const { selectedGroup, setSelectedGroup } = useGroupStore();
  const { students, setStudents } = useStudentStore();
  const { setPopupActive } = usePopupStore();
  const [dropdown, setDropdown] = useState(false);
 
  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      const response = await GetAllGroups();
      if (response.succes && response.data) {
        setGroups(response.data);
      } else {
        setError("Не удалось загрузить список групп");
      }
      setIsLoading(false);
    };
    isOpen &&fetchGroups();
    setPopupActive(isOpen);
  }, [isOpen]);
  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
    setError(null);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) {
      setError("Выберите группу");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await AddStudentSingle({
        name: studentName.trim(),
        groupsId: +selectedGroup.id,
        avatar: "uploads/avatars/default.jpg",
        reputation: 0
      });
      
      if (response.succes && response.data) {
        setStudents([...students, response.data]);
        setSelectedGroup(null);
        setStudentName('');
        ((e.target as HTMLFormElement).querySelector('input[type=text]')! as HTMLInputElement).value = '';
        
        // Store generated credentials for display
        if (response.data.generatedEmail && response.data.generatedPassword) {
          setGeneratedCredentials({
            email: response.data.generatedEmail,
            password: response.data.generatedPassword
          });
        }
        
        toast.success('Студент успешно добавлен');
      } else {
        setError("Ошибка при добавлении студента");
      }
    } catch (err) {
      setError("Ошибка при добавлении студента");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-[100vh] fixed top-0 left-0 z-50 backdrop-blur">
        <form
          onSubmit={handleSubmit}
          className="w-[300px] bg-[--respect-purple-deep] flex flex-col items-center justify-center p-5 rounded-lg gap-3"
        >
          {error && (
            <div className="text-red-500 text-sm w-full text-center bg-red-100 p-2 rounded">
              {error}
            </div>
          )}
          
          <input
            className="sm:max-w-xs w-full bg-[--respect-purple-add-inputs] rounded-lg py-2 pl-3 outline-none"
            placeholder="ФИО"
            type="text"
            onChange={e => setStudentName(e.target.value)}
            disabled={isLoading}
          />
          <div>
          <div className="relative cursor-pointer selection:bg-transparent flex flex-row justify-end items-center px-4 py-2 rounded-t-lg rounded-b-lg gap-5 bg-[--respect-purple-dark]" onClick={e => {
            const dropdown = e.currentTarget;
            dropdown.classList.toggle('rounded-b-lg');

            setDropdown(dropdown.querySelector("div")!.classList.contains("hidden"));
            dropdown.querySelector('div')!.classList.contains('hidden')?
            dropdown.querySelector('div')!.classList.replace('hidden', 'flex'):
            dropdown.querySelector('div')!.classList.replace('flex', 'hidden');
          }}>
            <p className="flex mr-auto">{selectedGroup?.name || 'Группа'}</p>
            <p className="hidden sm:block">|</p>
            {dropdown ? <FaAngleDown /> : <FaAngleUp />}

            <div className="hidden z-20 flex-col absolute left-0 top-full w-full max-h-64 overflow-y-scroll overflow-x-hidden rounded-b-lg border-[6px] border-t-0 border-[--respect-purple-dark] bg-[--respect-purple]">
                {groups.map((el, i) => 
                    <button type="button" className="px-3 py-2 text-left hover:backdrop-brightness-110 last:rounded-b-sm" key={i} onClick={_ => {
                        handleGroupSelect(el);
                        setSelectedGroup(el);
                    }}>{el.name}</button>
                )}
            </div>
          </div>
          </div>
          {generatedCredentials && (
            <div className="w-full p-3 bg-green-100 border border-green-400 rounded-lg text-green-800">
              <h3 className="font-bold mb-2">Данные для входа студента:</h3>
              <div className="space-y-1 text-sm">
                <div><strong>Email:</strong> {generatedCredentials.email}</div>
                <div><strong>Пароль:</strong> {generatedCredentials.password}</div>
              </div>
              <p className="text-xs mt-2 text-green-600">Сохраните эти данные! Пароль не будет показан снова.</p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="h-[40px] bg-[--respect-purple-dark] w-full flex items-center justify-center rounded-lg cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
             <Preloader/>
            ) : (
              "Добавить"
            )}
          </button>
          <button
            type="button"
            onClick={() => onClose()}
            disabled={isLoading}
            className="h-[40px] bg-[--respect-purple-dark] w-full flex items-center justify-center rounded-lg cursor-pointer disabled:opacity-50"
          >
            Отмена
          </button>
        </form>
      </div>
    </>
  );
};
export default SingleStudentPopup;