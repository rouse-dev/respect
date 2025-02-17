import { FaRegCalendarTimes } from "react-icons/fa";

interface FilterInterface {
  sortRespect: string,
  setSortRespect: (sort: string) => void,
  selectedDate1: string,
  selectedDate2: string,
  setSelectedDates: (date1?: string, date2?: string) => void
}

const Filter = ({sortRespect, setSortRespect, selectedDate1, selectedDate2, setSelectedDates}: FilterInterface) => {
  return (
    <div className="w-full flex gap-3">
      <button className="h-10 w-full px-4 bg-purple-400 rounded-lg" onClick={e => {
        switch (sortRespect) {
          case 'Все': {
            (e.target as HTMLElement).classList.replace('bg-purple-400', 'bg-green-400');
            setSortRespect('Зачисления');
            break;
          }
          case 'Зачисления': {
            (e.target as HTMLElement).classList.replace('bg-green-400', 'bg-red-400');
            setSortRespect('Списания');
            break;
          }
          case 'Списания': {
            (e.target as HTMLElement).classList.replace('bg-red-400', 'bg-purple-400');
            setSortRespect('Все');
            break;
          }
        }
      }}>{sortRespect}</button>
      <div className="flex flex-row items-center gap-3">
        <input
          type="date"
          className="h-10 w-full bg-[--respect-purple-dark] rounded-lg px-2"
          onChange={(e) => setSelectedDates(e.target.value, undefined)}
          max={new Date().toLocaleDateString().split('.').reverse().join('-')}
        ></input>
        <p className="whitespace-nowrap">—</p>
        <input
          type="date"
          className="h-10 w-full bg-[--respect-purple-dark] rounded-lg px-2"
          onChange={(e) => setSelectedDates(undefined, e.target.value)}
          max={new Date().toLocaleDateString().split('.').reverse().join('-')}
        ></input>
        <button disabled={!(selectedDate1.length > 0 || selectedDate2.length > 0)} className="self-stretch bg-[--respect-purple-dark] rounded-md px-[13px] disabled:text-gray-400" onClick={(e) => {
          e.currentTarget.parentElement!.querySelectorAll('input[type=date]').forEach(input_elem => {
            (input_elem as HTMLInputElement).value = '';
          });
          setSelectedDates('', '');
        }}><FaRegCalendarTimes /></button>
      </div>
    </div>
  );
};

export default Filter;