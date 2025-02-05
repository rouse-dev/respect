import { useEffect } from "react";
import { useAppContext } from "../../store/AppContext";

const SortByParams = () => {
  const {
    currentSortMethod,
    setCurrentSortMethod,
    sortMethods,
    sortDirection,
    setSortDirection,
    students,
    currentGroup,
    groups,
    setSortedStudents,
  } = useAppContext();

  // useEffect(() => {
  //   let result = [...students].filter((el) =>
  //     currentGroup === groups[0] ? el : el.group === currentGroup
  //   );
  //   switch (currentSortMethod) {
  //     case "По фамилии": {
  //       result.sort((a, b) => {
  //         if (sortDirection) return a.name.localeCompare(b.name, "ru");
  //         else return b.name.localeCompare(a.name, "ru");
  //       });
  //       break;
  //     }
  //     case "По группе": {
  //       result.sort((a, b) => {
  //         if (sortDirection)
  //           return a.group.localeCompare(b.group, "ru", { numeric: true });
  //         else return b.group.localeCompare(a.group, "ru", { numeric: true });
  //       });
  //       break;
  //     }
  //     case "По рейтингу": {
  //       if (sortDirection) result.sort((a, b) => a.respect - b.respect);
  //       else result.sort((a, b) => b.respect - a.respect);
  //       break;
  //     }
  //   }
  //   setSortedStudents(result);
  // }, [currentGroup, currentSortMethod, sortDirection, students, groups]);

  return (
    <div className="flex flex-row gap-2 sm:max-w-lg w-full">
      <div
        className="relative selection:bg-transparent w-full cursor-pointer flex flex-row justify-end items-center px-3 sm:px-5 py-2 rounded-t-lg rounded-b-lg gap-2 sm:gap-5 bg-[--respect-purple-deep]"
        onClick={(e) => {
          const dropdown = e.currentTarget;
          dropdown.classList.toggle("rounded-b-lg");

          dropdown.querySelector("div")!.classList.contains("hidden")
            ? dropdown.querySelector("div")!.classList.replace("hidden", "flex")
            : dropdown
                .querySelector("div")!
                .classList.replace("flex", "hidden");

          dropdown.querySelector("i")!.classList.contains("fa-angle-down")
            ? dropdown
                .querySelector("i")!
                .classList.replace("fa-angle-down", "fa-angle-up")
            : dropdown
                .querySelector("i")!
                .classList.replace("fa-angle-up", "fa-angle-down");
        }}
      >
        <p className="flex mr-auto">{currentSortMethod}</p>
        <p className="hidden sm:block">|</p>
        <i className="fa fa-angle-up" aria-hidden="true"></i>

        <div className="hidden z-10 flex-col absolute left-0 top-full w-full rounded-b-lg border-[6px] border-t-0 border-[--respect-purple-deep] bg-[--respect-purple]">
          {sortMethods.map((el, i) => (
            <button
              className="px-3 py-2 hover:backdrop-brightness-110 last:rounded-b-sm text-left"
              key={i}
              onClick={(_) => {
                setCurrentSortMethod(el);
              }}
            >
              {el}
            </button>
          ))}
        </div>
      </div>
      <button
        className="px-5 py-2 rounded-lg gap-5 bg-[--respect-purple-deep]"
        onClick={(_) => {
          setSortDirection(!sortDirection);
        }}
      >
        {sortDirection ? (
          <i className="fa fa-long-arrow-up" aria-hidden="true"></i>
        ) : (
          <i className="fa fa-long-arrow-down" aria-hidden="true"></i>
        )}
      </button>
    </div>
  );
};

export default SortByParams;