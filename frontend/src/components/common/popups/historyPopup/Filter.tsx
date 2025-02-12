interface FilterInterface {
  sortRespect: string,
  setSortRespect: (sort: string) => void,
  selectedDate: string,
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
      <div className="flex flex-row gap-3">
        <input
          type="date"
          className="h-10 w-full bg-[--respect-purple-dark] rounded-lg px-2"
          onChange={(e) => setSelectedDate(e.target.value)}
          max={new Date().toLocaleDateString().split('.').reverse().join('-')}
        ></input>
        <button disabled={selectedDate.length < 1} className="bg-[--respect-purple-dark] rounded-md px-3 disabled:text-gray-400" onClick={(e) => {
          (e.currentTarget.parentElement!.querySelector('input[type=date]') as HTMLInputElement).value = '';
          setSelectedDate('');
        }}><i className="fa fa-calendar-times-o" aria-hidden="true"></i></button>
      </div>
    </div>
  );
};

export default Filter;