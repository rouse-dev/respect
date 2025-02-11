interface FilterInterface {
  sortRespect: string,
  setSortRespect: (sort: string) => void
}

const Filter = ({sortRespect, setSortRespect}: FilterInterface) => {
  return (
    <>
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
      ></input>
    </>
  );
};

export default Filter;
