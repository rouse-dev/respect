import { useState, useEffect } from "react";
import { GetAllGroups, AddStudent } from "../../service/server";
import Preloader from "../preloader";
import { useAppContext } from "../../store/AppContext";

interface AddStudentPopup {
  onClose: () => void;
  isOpen: boolean;
}

interface Group {
  id: string;
  name: string;
}

const StudentPopup = ({ onClose, isOpen }: AddStudentPopup) => {
  const [dropdownState, setDropdownState] = useState({ open: false });
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [studentName, setStudentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { students, setStudents } = useAppContext();
 
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

  const handleDropdownClick = () =>
    setDropdownState({ open: !dropdownState.open });

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
    setDropdownState({ open: false });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) {
      setError("Выберите группу");
      return;
    }
    if (!studentName.trim()) {
      setError("Введите ФИО студента");
      return;
    }

    setIsLoading(true);
    setError(null);

    const fetchData = async () => {
      const response = await AddStudent({
        name: studentName.trim(),
        groupsId: selectedGroup.id,
      });

      if (response.succes) {
        setStudents([...students, response.data])
        setSelectedGroup(null);
        setStudentName("")
        onClose();
        
      } else {
        setError(response.error || "Ошибка при добавлении студента");
      }
      setIsLoading(false);
    };
    

    fetchData();
  };
  

  if (!isOpen) return null;
  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-[100vh] fixed top-0 left-0 z-50 backdrop-blur-sm">
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
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            disabled={isLoading}
          />
          <div>
            <button
              type="button"
              className="relative bg-[--respect-purple-add-inputs] text-white px-4 py-2 rounded"
              onClick={handleDropdownClick}
              disabled={isLoading}
            >
              {selectedGroup ? selectedGroup.name : "- группа -"}
            </button>
            {dropdownState.open && (
              <div className="absolute border-[--respect-purple-add-inputs] border-2 mt-2 w-48 bg-[--respect-purple-deep] rounded shadow-lg ml-[-35px] h-[200px] overflow-y-auto px-3 py-3">
                <ul className="flex flex-col gap-3">
                  {groups.map((group) => (
                    <li
                      key={group.id}
                      onClick={() => handleGroupSelect(group)}
                      className="px-4 py-2 cursor-pointer bg-[--respect-purple-add-inputs] hover:bg-[--respect-purple-dark]"
                    >
                      {group.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
export default StudentPopup;

function fetchData() {
  throw new Error("Function not implemented.");
}
