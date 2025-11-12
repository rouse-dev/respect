import { useState } from "react";
import Filter from "../../common/popups/historyPopup/Filter";
import HistoryItem from "../../../interfaces/history_item";
import { FaPlus } from "react-icons/fa";
import usePopupStore from "../../../store/popupStore";
import DiscardPopup from "../../common/popups/respectPopups/discard_popup";
import useUserStore from "../../../store/userStore";
import { Group } from "../../../interfaces/group";
import { Student } from "../../../interfaces/student";

export const DebtHistoryContainer = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [_, setSortedHistory] = useState<HistoryItem[]>([]);
  const [paginHistory, setPaginHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(Number);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortRespect, setSortRespect] = useState("Все");
  const [selectedDate1, setSelectedDate1] = useState<string>("");
  const [selectedDate2, setSelectedDate2] = useState<string>("");

  const { setPopupActive } = usePopupStore();
  const [isDiscardPopupOpen, setIsDiscardPopupOpen] = useState(false);
  
  // Получаем данные пользователя из стора
  const { name, email, studentId } = useUserStore();

  // Создаем mock объект группы
  const mockGroup: Group = {
    id: 1, // или другое значение по умолчанию
    name: "Группа по умолчанию",
    students: [] // или массив студентов, если требуется
  };

  // Создаем полный объект Student с правильными типами
  const currentStudent: Student = {
    id: studentId || 0,
    name: name || "Текущий студент",
    email: email || "",
    groups: mockGroup, // Один объект Group, а не массив
    groupsId: mockGroup.id, // number, а не массив
    reputation: 0 // Добавляем значение по умолчанию
  };

  const handleDateChange = (date1?: string, date2?: string) => {
    date1 !== undefined && setSelectedDate1(date1);
    date2 !== undefined && setSelectedDate2(date2);
    setCurrentPage(1);
  };

  const handleOpenDiscardPopup = () => {
    setPopupActive(true);
    setIsDiscardPopupOpen(true);
  };

  const handleCloseDiscardPopup = () => {
    setIsDiscardPopupOpen(false);
    setPopupActive(false);
  };

  return (
    <>
      <div className="w-[60%] h-[540px] bg-[--respect-purple-deep] rounded-lg p-3 px-4 overflow-y-auto flex flex-col gap-3">
        <h2 className="text-2xl text-center my-1">Список заявок</h2>
        <Filter
          sortRespect={sortRespect}
          setSortRespect={setSortRespect}
          selectedDate1={selectedDate1}
          selectedDate2={selectedDate2}
          setSelectedDates={handleDateChange}
        />
        <button 
          className="bg-[--respect-purple-light] p-2 rounded-lg cursor-pointer hover:brightness-110 transition-all flex items-center justify-center gap-2"
          onClick={handleOpenDiscardPopup}
        >
          <FaPlus /> Новая заявка 
        </button>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-2 border-red-500 gap-2 p-3 mr-3 w-full rounded-lg bg-[--respect-purple-dark] hover:opacity-90">
            <div className="flex flex-col gap-1">
              <p className="text-sm opacity-70">02.10.2024</p>
              <p>Причина</p>
            </div>
            <p className="font-bold text-red-400">-100</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-2 border-red-500 gap-2 p-3 mr-3 w-full rounded-lg bg-[--respect-purple-dark] hover:opacity-90">
            <div className="flex flex-col gap-1">
              <p className="text-sm opacity-70">02.10.2024</p>
              <p>Причина</p>
            </div>
            <p className="font-bold text-red-400">-100</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-2 border-red-500 gap-2 p-3 mr-3 w-full rounded-lg bg-[--respect-purple-dark] hover:opacity-90">
            <div className="flex flex-col gap-1">
              <p className="text-sm opacity-70">02.10.2024</p>
              <p>Причина</p>
            </div>
            <p className="font-bold text-red-400">-100</p>
          </div>
        </div>
      </div>

      <DiscardPopup
        student={currentStudent}
        isOpen={isDiscardPopupOpen}
        onClose={handleCloseDiscardPopup}
      />
    </>
  );
};