import SortByParams from "./SortByParams";
import SortBySearch from "./SortBySearch";

const Sort = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-5 justify-between">
        <SortByParams />
        <SortBySearch />
      </div>
    </>
  );
};

export default Sort;
