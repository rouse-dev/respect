import { useState } from "react";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import useFilterStore from "../../store/filterStore";

const SortByParams = () => {
  const {
    sortMethods,
    currentSortMethod,
    setCurrentSortMethod,
    sortDirection,
    setSortDirection,
  } = useFilterStore();

  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="flex flex-row gap-2 sm:max-w-lg w-full">
      <div
        className="relative selection:bg-transparent w-full cursor-pointer flex flex-row justify-end items-center px-3 sm:px-5 py-2 rounded-t-lg rounded-b-lg gap-1 sm:gap-5 bg-[--respect-purple-deep]"
        onClick={(e) => {
          const dropdown = e.currentTarget;
          dropdown.classList.toggle("rounded-b-lg");

          setDropdown(dropdown.querySelector("div")!.classList.contains("hidden"));
          dropdown.querySelector("div")!.classList.contains("hidden")
            ? dropdown.querySelector("div")!.classList.replace("hidden", "flex")
            : dropdown
                .querySelector("div")!
                .classList.replace("flex", "hidden");
        }}
      >
        <p className="flex mr-auto">{currentSortMethod}</p>
        <p className="hidden sm:block">|</p>
        {dropdown ? <FaAngleDown /> : <FaAngleUp />}

        <div className="hidden z-10 flex-col absolute left-0 top-full w-full rounded-b-lg border-[6px] border-t-0 border-[--respect-purple-deep] bg-[--respect-purple]">
          {sortMethods.map((el, i) => (
            <button
              className="px-3 py-2 cursor-pointer hover:backdrop-brightness-110 last:rounded-b-sm text-left"
              key={i}
              onClick={() => currentSortMethod !== el && setCurrentSortMethod(el)}
            >
              {el}
            </button>
          ))}
        </div>
      </div>
      <button
        className="px-4 py-2 rounded-lg gap-5 bg-[--respect-purple-deep] cursor-pointer hover:scale-98 hover:opacity-90"
        onClick={() => {
          setSortDirection(!sortDirection);
        }}
      >
        {sortDirection ? (
          <FaLongArrowAltUp />
        ) : (
          <FaLongArrowAltDown />
        )}
      </button>
    </div>
  );
};

export default SortByParams;