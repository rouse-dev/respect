import { FaRegCalendarTimes } from "react-icons/fa";

interface DebtFilterInterface {
  sortStatus: string;
  setSortStatus: (status: string) => void;
  selectedDate1: string;
  selectedDate2: string;
  setSelectedDates: (date1?: string, date2?: string) => void;
}

const DebtFilter = ({ 
  sortStatus, 
  setSortStatus, 
  selectedDate1, 
  selectedDate2, 
  setSelectedDates 
}: DebtFilterInterface) => {

  const handleFilterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    switch (sortStatus) {
      case 'Все': {
        (e.target as HTMLElement).classList.replace('bg-purple-400', 'bg-yellow-400');
        setSortStatus('В ожидании');
        break;
      }
      case 'В ожидании': {
        (e.target as HTMLElement).classList.replace('bg-yellow-400', 'bg-green-400');
        setSortStatus('Одобрено');
        break;
      }
      case 'Одобрено': {
        (e.target as HTMLElement).classList.replace('bg-green-400', 'bg-red-400');
        setSortStatus('Отклонено');
        break;
      }
      case 'Отклонено': {
        (e.target as HTMLElement).classList.replace('bg-red-400', 'bg-purple-400');
        setSortStatus('Все');
        break;
      }
    }
  };

  return (
    <div className="w-full flex gap-3">
      <button 
        className="h-10 w-full cursor-pointer px-4 bg-purple-400 rounded-lg" 
        onClick={handleFilterClick}
      >
        {sortStatus}
      </button>
      <div className="flex flex-row items-center gap-3">
        <input
          type="date"
          className="h-10 cursor-pointer w-full bg-[--respect-purple-dark] rounded-lg px-2"
          value={selectedDate1}
          onChange={(e) => setSelectedDates(e.target.value, undefined)}
          max={new Date().toLocaleDateString().split('.').reverse().join('-')}
        ></input>
        <p className="whitespace-nowrap">—</p>
        <input
          type="date"
          className="h-10 cursor-pointer w-full bg-[--respect-purple-dark] rounded-lg px-2"
          value={selectedDate2}
          onChange={(e) => setSelectedDates(undefined, e.target.value)}
          max={new Date().toLocaleDateString().split('.').reverse().join('-')}
        ></input>
        <button 
          disabled={!(selectedDate1.length > 0 || selectedDate2.length > 0)} 
          className="self-stretch bg-[--respect-purple-dark] cursor-pointer rounded-md px-[13px] disabled:cursor-not-allowed disabled:text-gray-400" 
          onClick={(e) => {
            e.currentTarget.parentElement!.querySelectorAll('input[type=date]').forEach(input_elem => {
              (input_elem as HTMLInputElement).value = '';
            });
            setSelectedDates('', '');
          }}
        >
          <FaRegCalendarTimes />
        </button>
      </div>
    </div>
  );
};

export default DebtFilter;