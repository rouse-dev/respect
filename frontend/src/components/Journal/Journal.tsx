import { Link } from "react-router-dom";
import Group from "../Group/group";
import { BiBell } from "react-icons/bi";
import { useState, useEffect } from "react";
import { GetAllDebt as GetAllDebtTeacher } from "../../service/teacher";
import { DebtRequest } from "../../interfaces/debt_request";

interface useUserStoreInterface {
  auth: boolean,
  name: string,
  email: string,
  avatar: string
}

interface JournalInterface {
    useUserStore: useUserStoreInterface
}

const Journal = ({ useUserStore }: JournalInterface) => {
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPendingDebtCount = async () => {
    try {
      const response = await GetAllDebtTeacher();
      if (response.success && response.data) {
        const pendingRequests = response.data.filter((request: DebtRequest) => request.status === 'pending');
        setPendingCount(pendingRequests.length);
      }
    } catch (error) {
      console.error('Ошибка при загрузке количества заявок:', error);
      setPendingCount(0);
    }
  };

  useEffect(() => {
    fetchPendingDebtCount();
  }, []);

  return (
      <div className="flex flex-col sm:flex-row gap-5 justify-between mb-6 sm:mb-12">
      <Group />
     <div className="flex order-1 gap-3">
      <Link className="flex flex-row order-1 sm:order-2 justify-center items-center px-3 py-2 rounded-lg gap-4 bg-[--respect-purple-deep]"
        to="/profile">
        <p className="flex w-fit whitespace-nowrap overflow-hidden">
          {useUserStore.name ? useUserStore.name : "- Фамилия И.О. -"}
        </p>
        <img
          className="w-11 h-11 rounded-[100%]"
          src={
            useUserStore.avatar
              ? `${import.meta.env.VITE_API_URL}/${useUserStore.avatar}`
              : `${import.meta.env.VITE_API_URL}/uploads/avatars/default.jpg`
          }
        />
      </Link> 
      <Link to='/debt' className="relative flex gap-2 border-1 items-center bg-[--respect-purple-deep] px-3 rounded-lg py-[10px]">
          {pendingCount > 0 && (
            <div className="px-2 h-5 bg-red-500 rounded-md text-[12px] font-bold flex items-center justify-center absolute top-[-5px] right-[-5px]">
              {pendingCount}
            </div>
          )}
          <BiBell className="text-2xl"></BiBell>
      </Link>
     </div>
      
    </div>
  )
}

export default Journal;