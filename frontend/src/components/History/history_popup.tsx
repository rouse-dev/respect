import { useEffect, useState } from "react";
import { HistoryStudent } from "../../service/server";
import Preloader from "../preloader";
import { useAppContext } from "../../store/AppContext";
import Paginator from "./paginator";
import ExcelHistoryButton from "./ExcelHistoryButton";

interface HistoryPopupProps {
  studentId: number;
  onClose: () => void;
  isOpen: boolean;
}

interface HistoryItem {
  change: number;
  reason: string;
  createdAt: string;
}

const HistoryPopup = ({ studentId, onClose, isOpen }: HistoryPopupProps) => {
  const { setPopupActive } = useAppContext();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [paginHistory, setPaginHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(Number);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!isOpen || !studentId) return;

      setIsLoading(true);
      try {
        const result = await HistoryStudent(studentId);
        if (result.succes) {
          const reversedHistory = [...result.data].reverse();
          setHistory(reversedHistory);
          setPaginHistory(reversedHistory.slice(0, 3));
          setTotalPages(Math.ceil(reversedHistory.length / 3));
        } else {
          alert(result.error);
        }
      } catch (error) {
        console.error("Ошибка при загрузке истории:", error);
        alert("Произошла ошибка при загрузке истории");
      } finally {
        setIsLoading(false);
      }
    };
    setPopupActive(isOpen);
    fetchHistory();
  }, [studentId, isOpen]);

  useEffect(() => {
    setPaginHistory(history.slice((currentPage - 1) * 3, currentPage * 3));
  }, [history, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };


  if (!isOpen) return null;

  return (
    <>
      {isLoading && <Preloader />}
      <div
        id="respect_history_popup"
        className="flex justify-center items-center w-full h-[100vh] fixed top-0 left-0 z-50 backdrop-blur-sm"
      >
        <div
          className="flex flex-col gap-3 bg-[--respect-purple] max-w-2xl w-full p-5 m-5 rounded-lg"
          style={{
            boxShadow: "inset 0px 0px 8px 2px var(--respect-purple-dark)",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">История изменений респекта</h2>
            <button
              className="bg-[--respect-purple-dark] p-2 rounded-lg"
              onClick={onClose}
            >
              <i className="fa fa-times" aria-hidden="true"></i>
            </button>
          </div>
          <ExcelHistoryButton studentId={studentId} name={"testing"} />
          <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
            <p>{}</p>
            {paginHistory.length > 0 ? (
              paginHistory.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-2  gap-2 p-3 mr-3 rounded-lg  bg-[--respect-purple-dark] ${
                    item.change > 0 ? "border-green-500" : "border-red-500"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm opacity-70">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>

                    <p>{item.reason}</p>
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
