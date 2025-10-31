import useFilterStore from "../../store/filterStore";

const SortByTop = () => {
  const { setSortTop } = useFilterStore();

  return (
    <div className="flex flex-row items-center gap-2 bg-[--respect-purple-deep] rounded-md pl-3 pr-2">
      <p className="whitespace-nowrap">Топ - </p>
      <input
        type="text"
        className="w-9 pl-2 bg-[--respect-purple-dark] rounded-md outline-hidden"
        placeholder="...."
        onChange={(e) => {
          if (isNaN(+e.target.value)) {
            e.target.value = e.target.value.slice(0, e.target.value.length - 2);
            return;
          }
          setSortTop(Number(e.target.value));
        }}
      />
    </div>
  );
};

export default SortByTop;