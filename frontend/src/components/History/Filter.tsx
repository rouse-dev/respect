interface FilterInterface {
  sortRespect: string,
  setSortRespect: (sort: string) => void,
  selectedDate: string | null,
  setSelectedDate: (date: string) => void
}

const Filter = ({sortRespect, setSortRespect, selectedDate, setSelectedDate}: FilterInterface) => {
  return (
    <div className="w-full flex gap-3">
      <button className="h-10 w-full bg-purple-400 rounded-lg" onClick={e => {
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
      <input
        type="date"
        className="h-10 w-full bg-[--respect-purple-dark] rounded-lg pl-4"
        value={selectedDate || ''}
        onChange={(e) => setSelectedDate(e.target.value)}
      ></input>
    </div>
  );
};

export default Filter;