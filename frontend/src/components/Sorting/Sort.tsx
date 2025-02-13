import SortByParams from "./SortByParams";
import SortBySearch from "./SortBySearch";
import SortByTop from "./SortByTop";

const Sort = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-5 justify-between">
        <SortByParams />
        <div className="flex flex-row gap-5">
          <SortByTop />
          <SortBySearch />
        </div>
      </div>
    </>
  );
};

export default Sort;
