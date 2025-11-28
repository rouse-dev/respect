import { useState, useEffect,useRef } from "react";
import Preloader from "../../preloader/preloader";
import ExcelReader from "../../utils/excelReader";
import { toast } from "react-toastify";

import hint from '../../../../assets/media/hint.png';
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { Group } from "../../../../interfaces/group";
import { StudentData } from "../../../../interfaces/student";
import useStudentStore from "../../../../store/studentStore";
import useGroupStore from "../../../../store/groupStore";
import usePopupStore from "../../../../store/popupStore";
import { AddStudentMany, GetAllGroups } from "../../../../service/admin";

interface AddStudentPopup {
  onClose: () => void;
  isOpen: boolean;
}

const StudentPopup = ({ onClose, isOpen }: AddStudentPopup) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [data, setData] = useState<StudentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedCredentials, setGeneratedCredentials] = useState<Array<{name: string, email: string, password: string}> | null>(null);
  const { students, setStudents } = useStudentStore();
  const { selectedGroup, setSelectedGroup, exportGroup, setExportGroup } = useGroupStore();
  const { setPopupActive } = usePopupStore();
  const [dropdown, setDropdown] = useState(false);

  const hintRef = useRef<HTMLDivElement>(null);
  

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
    isOpen ? fetchGroups() : setExportGroup(null);
    setPopupActive(isOpen);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!exportGroup) {
      setError("Выберите группу");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AddStudentMany(data);
      if (response.succes && response.data) {
        setStudents([...students, ...response.data]);
        setExportGroup(null);
        
        // Extract credentials from all added students
        const credentials = response.data.map((student: any) => ({
          name: student.name,
          email: student.generatedEmail,
          password: student.generatedPassword
        })).filter((cred: any) => cred.email && cred.password);
        
        if (credentials.length > 0) {
          setGeneratedCredentials(credentials);
        }
        
        toast.success('Студенты успешно добавлены');
      } else {
        setError("Ошибка при добавлении студентов");
      }
    } catch (err) {
      setError("Ошибка при добавлении студентов");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col justify-center items-center w-full h-[100vh] fixed top-0 left-0 z-50 backdrop-blur">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-[--respect-purple-deep] flex flex-col items-center justify-center p-5 rounded-lg gap-3"
      >
        {error && (
          <div className="text-red-500 text-sm w-full text-center bg-red-100 p-2 rounded-sm">
            {error}
          </div>
        )}

        <div className="w-full">
          <div className="hidden md:flex ml-auto -mb-7  flex-row items-center justify-center w-8 h-8 bg-[--respect-purple-dark] rounded-[100%] cursor-help"
          onMouseEnter={_ => {
            if(hintRef.current){
               hintRef.current.classList.replace('hidden', 'flex');
            }
           
          }}
          onMouseLeave={_ => {
            if(hintRef.current){
              hintRef.current.classList.replace('flex', 'hidden');
            }
            
          }}
          onMouseMove={e => {
            if(hintRef.current){
              hintRef.current.style.left = e.clientX + 15 + 'px';
              hintRef.current.style.top = e.clientY + 15 + 'px';
            }        
          }}
          >?</div>
          <div ref={hintRef} className="absolute hidden rounded-md max-w-64 flex-col items-center justify-center gap-1 p-4 bg-[--respect-purple-deep] shadow-[0px_0px_50px_var(--respect-purple-dark)]">
            <p>Пример файла:</p>
            <img className="rounded-b-md w-full" src={hint} />
          </div>
        </div>
        <div className="relative cursor-pointer selection:bg-transparent flex flex-row justify-end items-center px-4 py-2 rounded-t-lg rounded-b-lg gap-5 bg-[--respect-purple-dark]" onClick={e => {
          const dropdown = e.currentTarget;
          dropdown.classList.toggle('rounded-b-lg');

          setDropdown(dropdown.querySelector("div")!.classList.contains("hidden"));
          dropdown.querySelector('div')!.classList.contains('hidden')?
          dropdown.querySelector('div')!.classList.replace('hidden', 'flex'):
          dropdown.querySelector('div')!.classList.replace('flex', 'hidden');
        }}>
          <p className="flex mr-auto">{exportGroup?.name || 'Группа'}</p>
          <p className="hidden sm:block">|</p>
          {dropdown ? <FaAngleDown /> : <FaAngleUp />}

          <div className="hidden z-20 flex-col absolute left-0 top-full w-full max-h-64 overflow-y-scroll overflow-x-hidden rounded-b-lg border-[6px] border-t-0 border-[--respect-purple-dark] bg-[--respect-purple]">
              {groups.map((el, i) => 
                  <button type="button" className="px-3 py-2 text-left hover:backdrop-brightness-110 last:rounded-b-sm" key={i} onClick={_ => {
                      setExportGroup(el);
                      setSelectedGroup(el);
                  }}>{el.name}</button>
              )}
          </div>
        </div>
        
        {selectedGroup && <ExcelReader setData={setData} />}

        {generatedCredentials && generatedCredentials.length > 0 && (
          <div className="w-full p-3 bg-green-100 border border-green-400 rounded-lg text-green-800 max-h-64 overflow-y-auto">
            <h3 className="font-bold mb-2">Данные для входа студентов:</h3>
            <div className="space-y-2 text-xs">
              {generatedCredentials.map((cred, index) => (
                <div key={index} className="border-b border-green-300 pb-2 last:border-b-0">
                  <div><strong>ФИО:</strong> {cred.name}</div>
                  <div><strong>Email:</strong> {cred.email}</div>
                  <div><strong>Пароль:</strong> {cred.password}</div>
                </div>
              ))}
            </div>
            <p className="text-xs mt-2 text-green-600">Сохраните эти данные! Пароли не будут показаны снова.</p>
          </div>
        )}
        

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 h-[40px] bg-[--respect-purple-dark] w-full flex items-center justify-center rounded-lg cursor-pointer disabled:opacity-50"
        >
          {isLoading ? <Preloader /> : "Добавить"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="h-[40px] bg-[--respect-purple-dark] w-full flex items-center justify-center rounded-lg cursor-pointer disabled:opacity-50"
        >
          Отмена
        </button>
      </form>
    </div>
  );
};

export default StudentPopup;