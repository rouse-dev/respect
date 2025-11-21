

import { useState, useEffect } from "react";
import { DebtRequest } from "../../interfaces/debt_request";
import { GetAllDebt as GetAllDebtTeacher } from "../../service/teacher";
import { AcceptDebt, RejectDebt } from "../../service/teacher";
import { toast } from "react-toastify";
import Preloader from "../common/preloader/preloader";

export const DebtView = () => {
  const [debtRequests, setDebtRequests] = useState<DebtRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<DebtRequest | null>(null);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchDebtRequests = async () => {
    setIsLoading(true);
    try {
      const response = await GetAllDebtTeacher();
      if (response.success && response.data) {
        console.log('Debt requests data:', response.data);
        const pendingRequests = response.data.filter((request: DebtRequest) => request.status === 'pending');
        setDebtRequests(pendingRequests);
      } else if (response.error) {
        console.error('Ошибка при загрузке заявок:', response.error);
        toast.error('Ошибка при загрузке заявок');
      }
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
      toast.error('Ошибка при загрузке заявок');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDebtRequests();
  }, []);

  const handleRequestClick = (request: DebtRequest) => {
    setSelectedRequest(request);
    setComment("");
  };

  const handleAccept = async () => {
    if (!selectedRequest) return;
    
    setIsProcessing(true);
    try {
      const result = await AcceptDebt({
        id: selectedRequest.id,
        comment: comment || "Заявка одобрена, долг списан"
      });
      
      if (result && !result.error) {
        fetchDebtRequests();
        setSelectedRequest(null);
        setComment("");
      } else if (result && result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Ошибка при принятии заявки:", error);
      toast.error("Ошибка при принятии заявки");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    
    setIsProcessing(true);
    try {
      const result = await RejectDebt({
        id: selectedRequest.id,
        comment: comment || "Заявка отклонена"
      });
      
      if (result && !result.error) {
        toast.success("Заявка отклонена");
        fetchDebtRequests();
        setSelectedRequest(null);
        setComment("");
      } else if (result && result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Ошибка при отклонении заявки:", error);
      toast.error("Ошибка при отклонении заявки");
    } finally {
      setIsProcessing(false);
    }
  };

  const getBorderColorByStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'border-yellow-500';
      case 'approved':
        return 'border-green-500';
      case 'rejected':
        return 'border-red-500';
      default:
        return 'border-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      {isProcessing && <Preloader />}
      <div className="w-full h-[525px] bg-[--respect-purple-deep] rounded-2xl flex p-3 px-6  overflow-hidden">
        <div className="w-[50%]">
          <p className="text-3xl mb-2">Заявки</p>

          <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-4">Загрузка заявок...</div>
            ) : debtRequests.length === 0 ? (
              <div className="text-center py-4 text-gray-400">Нет заявок на списание</div>
            ) : (
              debtRequests.map((request) => (
                <div 
                  key={request.id} 
                  className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-2 ${getBorderColorByStatus(request.status)} gap-2 p-3 mr-3 w-full rounded-lg bg-[--respect-purple-dark] hover:opacity-90 cursor-pointer transition-all duration-200 ${
                    selectedRequest?.id === request.id ? 'brightness-200' : ''
                  }`}
                  onClick={() => handleRequestClick(request)}
                >
                  <div className="flex flex-col gap-1">
                     <p className="text-sm opacity-70">{formatDate(request.createdAt)}</p>
                     <p className="font-semibold">{request.student.name}</p>
                     <p className="text-sm text-blue-300">Группа: {request.student.groups.name}</p>
                     <p>{request.description}</p>
                     <p className="text-sm opacity-70">{request.lesson.name}</p>
                   </div>
                  <p className={`font-bold ${request.status === 'rejected' ? 'text-red-400' : request.status === 'approved' ? 'text-green-400' : 'text-yellow-400'}`}>
                    -{request.points}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="w-[50%] px-8">
          <form className="h-[60%]" onSubmit={(e) => e.preventDefault()}>
            <label className="text-3xl">Оставить комментарий</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Введите комментарий..."
              className="mt-2 bg-[--respect-purple-deep] outline-none border-2 border-[--respect-purple-dark] w-full h-[100%] rounded-xl p-2 resize-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              disabled={!selectedRequest}
            ></textarea>
            <div className="flex flex-col gap-3 mt-4">
              <button 
                onClick={handleAccept}
                disabled={!selectedRequest || isProcessing}
                className="p-4 px-5 bg-[#7fad75] rounded-2xl text-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
              >
                Принять
              </button>
              <button 
                onClick={handleReject}
                disabled={!selectedRequest || isProcessing}
                className="p-4 px-7 bg-red-400 rounded-2xl text-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-500 transition-colors"
              >
                Отклонить
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}