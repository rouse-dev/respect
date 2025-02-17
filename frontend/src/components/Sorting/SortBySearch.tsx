import { useAppContext } from "../../store/AppContext";

const SortBySearch = () => {
  const { search, setSearch } = useAppContext();

  return (
    <input
      className="sm:max-w-xs w-full bg-(--respect-purple-deep) rounded-lg py-2 pl-3 outline-hidden"
      placeholder="Поиск..."
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default SortBySearch;
