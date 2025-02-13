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
    search,
    setSortedStudents,
  } = useAppContext();

  useEffect(() => {
    let result = [...students];
    if (currentGroup) {
      result = result.filter((el) => el.groups.name === currentGroup.name);
    }
    if (search.length > 0) {
      result = result.filter((el) =>
        el.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (currentSortMethod) {
      case "По фамилии": {
        result.sort((a, b) => {
          const compareResult = a.name.localeCompare(b.name, "ru");
          return sortDirection ? compareResult : -compareResult;
        });
        break;
      }
      case "По группе": {
        result.sort((a, b) => {
          const compareResult = a.groups.name.localeCompare(
            b.groups.name,
            "ru",
            { numeric: true }
          );
          return sortDirection ? compareResult : -compareResult;
        });
        break;
      }
      case "По рейтингу": {
        result.sort((a, b) => {
          const compareResult = a.reputation - b.reputation;
          return sortDirection ? compareResult : -compareResult;
        });
        break;
      }
      default:
        break;
    }

    setSortedStudents(result);
  }, [search, students, currentGroup, currentSortMethod, sortDirection]);

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