import { useEffect, useState } from "react";
import Preloader from "../../preloader/preloader";
import Paginator from "./Paginator";
import ExcelHistoryButton from "./ExcelHistoryButton";
import Filter from "./Filter";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { Student } from "../../../../interfaces/student";
import usePopupStore from "../../../../store/popupStore";
import { HistoryStudent } from "../../../../service/teacher";
import HistoryItem from "../../../../interfaces/history_item";

interface HistoryPopupProps {
  student: Student
  onClose: () => void;
  isOpen: boolean;
}



const HistoryPopup = ({
  student,
  onClose,
  isOpen
}: HistoryPopupProps) => {
  const { setPopupActive,popupElementRef } = usePopupStore();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [_, setSortedHistory] = useState<HistoryItem[]>([]);
  const [paginHistory, setPaginHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(Number); //
  const [currentPage, setCurrentPage] = useState(1); //

  const [sortRespect, setSortRespect] = useState('Все');
  const [selectedDate1, setSelectedDate1] = useState<string>('');
  const [selectedDate2, setSelectedDate2] = useState<string>('');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      try {
        const result = await HistoryStudent(student.id);
        if (result.succes) {
          const reversedHistory = [...result.data].reverse();
          setHistory(reversedHistory);
          setSortedHistory(reversedHistory);
          setPaginHistory(reversedHistory.slice(0, 3));
          setTotalPages(Math.ceil(reversedHistory.length / 3));
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        console.error("Ошибка при загрузке истории:", error);
        toast.error("Произошла ошибка при загрузке истории");
      } finally {
        setIsLoading(false);
      }
    };
    setPopupActive(isOpen);
    fetchHistory();
  }, [student.id, isOpen]);

  useEffect(() => {
    let filteredHistory = [...history];

    // Фильтрация по типу изменений
    if (sortRespect === 'Зачисления') {
      filteredHistory = filteredHistory.filter(item => item.change > 0);
    } else if (sortRespect === 'Списания') {
      filteredHistory = filteredHistory.filter(item => item.change < 0);
    }

    // Фильтрация по дате
    if (selectedDate1.length || selectedDate2.length) {
      filteredHistory = filteredHistory.filter(item => {
        const itemDate = new Date(item.createdAt).getTime();
        const date1Formatted = selectedDate1.length ? new Date(selectedDate1).getTime() : 0;
        const date2Formatted = selectedDate2.length ? new Date(selectedDate2).getTime() : 0;

        if (selectedDate1 && selectedDate2) {
          return (itemDate >= date1Formatted) && (itemDate <= date2Formatted);
        } else {
          if (selectedDate1) return itemDate >= date1Formatted;
          if (selectedDate2) return itemDate <= date2Formatted;
        }
      });
    }

    setSortedHistory(filteredHistory);
    setPaginHistory(filteredHistory.slice((currentPage - 1) * 3, currentPage * 3));
    setTotalPages(Math.ceil(filteredHistory.length / 3));
  }, [sortRespect, selectedDate1, selectedDate2, currentPage, history]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleDateChange = (date1?: string, date2?: string) => {
    (date1 !== undefined) && setSelectedDate1(date1);
    (date2 !== undefined) && setSelectedDate2(date2);
    setCurrentPage(1);
  };
  if (!isOpen) return null;

  return (
    <>
      {isLoading && <Preloader />}
      <div
      ref={popupElementRef}
        className="flex justify-center items-center w-full h-[100vh] fixed top-0 left-0 z-50 backdrop-blur"
      >
        <div
          className="flex flex-col gap-3 bg-[--respect-purple] max-w-2xl w-full p-6 m-5 rounded-lg"
          style={{
            boxShadow: "inset 0px 0px 8px 2px var(--respect-purple-dark)",
          }}
        >
          <div className="flex justify-end gap-3">
            <p className="w-full h-10 bg-[--respect-purple-dark] flex items-center justify-center rounded-lg">
              {student.name}
            </p>
            <p className="w-fit whitespace-nowrap px-4 h-10 bg-[--respect-purple-dark] flex items-center justify-center rounded-lg">
              Репутация: {student.reputation}
            </p>
            <button
              className="bg-[--respect-purple-dark] px-[13px] rounded-lg h-10 cursor-pointer hover:opacity-50"
              onClick={onClose}
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex justify-between gap-3">
            <Filter 
              sortRespect={sortRespect} 
              setSortRespect={setSortRespect}
              selectedDate1={selectedDate1}
              selectedDate2={selectedDate2}
              setSelectedDates={handleDateChange}
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">История изменений респекта</h2>
            <ExcelHistoryButton studentId={student.id} name={student.name} />
          </div>

          <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
            {paginHistory.length > 0 ? (
              paginHistory.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-2  gap-2 p-3 mr-3 w-full rounded-lg  bg-[--respect-purple-dark] ${
                    item.change > 0 ? "border-green-500" : "border-red-500"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm opacity-70">
                     {new Date(item.createdAt).toLocaleDateString()}
                    </p>

                    <p>{item.lesson} {item.class == "" ? "" : `| Пара: ${item.class} `}| {item.reason}</p>
                  </div>
                  <p
                    className={`font-bold ${
                      item.change > 0 ? "text-[#7fad75]" : "text-red-400"
                    }`}
                  >
                    {item.change > 0 ? "+" : ""}
                    {item.change}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center py-4">История изменений пуста</p>
            )}
          </div>
          <div>
            <Paginator
              totalPages={totalPages}
              currentPage={currentPage}
              goToPage={goToPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryPopup;