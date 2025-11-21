import { useState, useEffect } from "react";
import DebtFilter from "../../common/utils/DebtFilter";
import { FaPlus } from "react-icons/fa";
import usePopupStore from "../../../store/popupStore";
import DiscardPopup from "../../common/popups/respectPopups/discard_popup";
import useUserStore from "../../../store/userStore";
import { Group } from "../../../interfaces/group";
import { Student } from "../../../interfaces/student";
import { GetAllDebt as GetAllDebtStudent } from "../../../service/student";
import { GetAllDebt as GetAllDebtTeacher } from "../../../service/teacher";
import { DebtRequest } from "../../../interfaces/debt_request";

export const DebtHistoryContainer = () => {
  const [debtRequests, setDebtRequests] = useState<DebtRequest[]>([]);
  const [filteredDebtRequests, setFilteredDebtRequests] = useState<DebtRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [sortStatus, setSortStatus] = useState("Все");
  const [selectedDate1, setSelectedDate1] = useState<string>("");
  const [selectedDate2, setSelectedDate2] = useState<string>("");

  const { setPopupActive } = usePopupStore();
  const [isDiscardPopupOpen, setIsDiscardPopupOpen] = useState(false);

  const { name, email, studentId, role } = useUserStore();

  const mockGroup: Group = {
    id: 1,
    name: "Группа по умолчанию",
    students: [],
  };

  const currentStudent: Student = {
    id: studentId || 0,
    name: name || "Текущий студент",
    email: email || "",
    groups: mockGroup,
    groupsId: mockGroup.id,
    reputation: 0,
  };

  const fetchDebtRequests = async () => {
    setIsLoading(true);
    try {
      const response =
        role === "teacher"
          ? await GetAllDebtTeacher()
          : await GetAllDebtStudent();
      if (response.success && response.data) {
        console.log("Debt requests data:", response.data);
        console.log("First request structure:", response.data[0]);
        setDebtRequests(response.data);
        setFilteredDebtRequests(response.data); 
      } else if (response.error) {
        console.error("Ошибка при загрузке заявок:", response.error);
      }
    } catch (error) {
      console.error("Ошибка при загрузке заявок:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDebtRequests();
  }, []);

  useEffect(() => {
    let filtered = debtRequests;

    if (sortStatus !== 'Все') {
      const statusMap: { [key: string]: string } = {
        'В ожидании': 'pending',
        'Одобрено': 'approved',
        'Отклонено': 'rejected'
      };
      
      filtered = filtered.filter(request => 
        request.status === statusMap[sortStatus]
      );
    }

    if (selectedDate1 || selectedDate2) {
      filtered = filtered.filter(request => {
        const requestDate = new Date(request.createdAt).getTime();
        const date1Time = selectedDate1 ? new Date(selectedDate1).getTime() : 0;
        const date2Time = selectedDate2 ? new Date(selectedDate2).getTime() : Date.now();

        if (selectedDate1 && selectedDate2) {
          return requestDate >= date1Time && requestDate <= date2Time;
        } else if (selectedDate1) {
          return requestDate >= date1Time;
        } else if (selectedDate2) {
          return requestDate <= date2Time;
        }
        return true;
      });
    }

    setFilteredDebtRequests(filtered);
  }, [sortStatus, selectedDate1, selectedDate2, debtRequests]);

  const handleDateChange = (date1?: string, date2?: string) => {
    date1 !== undefined && setSelectedDate1(date1);
    date2 !== undefined && setSelectedDate2(date2);
  };

  const handleOpenDiscardPopup = () => {
    setPopupActive(true);
    setIsDiscardPopupOpen(true);
  };

  const handleCloseDiscardPopup = () => {
    setIsDiscardPopupOpen(false);
    setPopupActive(false);
    fetchDebtRequests();
  };

  const getBorderColorByStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "border-yellow-500";
      case "approved":
        return "border-green-500";
      case "rejected":
        return "border-red-500";
      default:
        return "border-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="w-[60%] h-[540px] bg-[--respect-purple-deep] rounded-lg p-3 px-4 overflow-y-auto flex flex-col gap-3">
        <h2 className="text-2xl text-center my-1">Список заявок</h2>
        <DebtFilter
          sortStatus={sortStatus}
          setSortStatus={setSortStatus}
          selectedDate1={selectedDate1}
          selectedDate2={selectedDate2}
          setSelectedDates={handleDateChange}
        />
        {role !== "teacher" && (
          <button
            className="bg-[--respect-purple-light] p-2 rounded-lg cursor-pointer hover:brightness-110 transition-all flex items-center justify-center gap-2"
            onClick={handleOpenDiscardPopup}
          >
            <FaPlus /> Новая заявка
          </button>
        )}
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="text-center py-4">Загрузка заявок...</div>
          ) : filteredDebtRequests.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              У вас пока нет заявок на списание
            </div>
          ) : (
            filteredDebtRequests.map((request) => (
              <div
                key={request.id}
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-2 ${getBorderColorByStatus(
                  request.status
                )} gap-2 p-3 mr-3 w-full rounded-lg bg-[--respect-purple-dark] hover:opacity-90`}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm opacity-70">
                    {formatDate(request.createdAt)}
                  </p>
                  {role === "teacher" && (
                    <>
                      <p className="text-sm font-semibold text-blue-300">
                        Студент: {request.student.name}
                      </p>
                      <p className="text-sm text-blue-300">
                        Группа: {request.student.groups.name}
                      </p>
                    </>
                  )}
                  <p>{request.description}</p>
                  <p className="text-sm opacity-70">{request.lesson.name}</p>
                  {request.teacherComment &&
                    request.teacherComment.trim() !== "" && (
                      <p
                        className={`text-sm ${
                          request.status === "rejected"
                            ? "text-red-400"
                            : request.status === "approved"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        Комментарий учителя: {request.teacherComment}
                      </p>
                    )}
                </div>
                <p
                  className={`font-bold ${
                    request.status === "rejected"
                      ? "text-red-400"
                      : request.status === "approved"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  -{request.points}
                </p>
              </div>
            ))
          )}
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
