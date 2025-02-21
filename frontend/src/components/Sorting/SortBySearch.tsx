import { useAppContext } from "../../store/AppContext";

const SortBySearch = () => {
  const { search, setSearch } = useAppContext();

  return (
    <input
      className={`placeholder:text-[#8e8e8e] sm:max-w-xs w-full bg-[--respect-purple-deep] rounded-lg py-2 pl-3 pr-9 outline-hidden ${search.length ? 'bg-[url(./assets/media/lypa-white.svg)]' : 'bg-[url(./assets/media/lypa-grey.svg)]'} bg-no-repeat bg-[calc(100%-8px)_center] bg-[24px_auto]`}
      placeholder="Поиск..."
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default SortBySearch;
