import { useState, useEffect } from "react";
import { GetAllGroups, AddStudent } from "../../../../service/server";
import Preloader from "../../preloader/preloader";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { Group, useAppContext } from "../../../../store/AppContext";
import { toast } from "react-toastify";

interface SingleStudentPopupInterface {
  onClose: () => void;
  isOpen: boolean;
}

const SingleStudentPopup = ({ onClose, isOpen }: SingleStudentPopupInterface) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [studentName, setStudentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { students, setStudents, selectedGroup, setSelectedGroup } = useAppContext();
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
    if (isOpen) {
      fetchGroups();
    }
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
      AddStudent([{
          name: studentName.trim(),
          groupsId: +selectedGroup.id,
        }]).then(res => {
        setStudents([...students, ...res.data]);
        setSelectedGroup(null);
        setStudentName('');
        ((e.target as HTMLFormElement).querySelector('input[type=text]')! as HTMLInputElement).value = '';
      });
      toast.success('Студент успешно добавлен')
      onClose();
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