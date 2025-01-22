import { useAppContext } from "../context/AppContext";
import { useEffect } from "react";

const Students = () => {
  const { sortedStudents, search, setCurrentStudent, currentStudent } =
    useAppContext();

  useEffect(() => {
    Object.keys(currentStudent).length === 0
      ? document
          .getElementById("respect_history_popup")!
          .classList.replace("flex", "hidden")
      : document
          .getElementById("respect_history_popup")!
          .classList.replace("hidden", "flex");
  }, [currentStudent]);

  return (
    <div className="flex flex-col gap-5 bg-[--respect-purple-deep] p-5 rounded-lg">
      <div className="hidden sm:flex flex-row gap-5">
        <p className="rounded-lg px-3 py-2 bg-[--respect-purple-dark] w-2/6">
          ФИО
        </p>
        <p className="rounded-lg px-3 py-2 bg-[--respect-purple-dark] w-1/6">
          Группа
        </p>
        <p className="rounded-lg px-3 py-2 bg-[--respect-purple-dark] w-3/6">
          Респект
        </p>
      </div>
      <div className="flex sm:hidden flex-row gap-5">
        <p className="rounded-lg px-2 py-1 bg-[--respect-purple-dark] w-2/3">
          ФИО / Группа
        </p>
        <p className="rounded-lg text-center px-2 py-1 bg-[--respect-purple-dark] w-1/3 overflow-hidden overflow-ellipsis">
          Респект
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {sortedStudents.map((el) => {
          const show =
            search.length === 0 ||
            el.name.toLowerCase().includes(search.toLowerCase(), 0);

          if (show)
            return (
              <div
                key={sortedStudents.indexOf(el)}
                className={`flex flex-row bg-[--respect-purple] rounded-lg py-1`}
              >
                <div className="flex flex-col sm:flex-row justify-between sm:gap-5 w-2/3 sm:w-1/2">
                  <p
                    className="px-3 py-2 w-2/3 text-xl sm:text-lg cursor-pointer hover:underline active:"
                    onClick={(_) => {
                      setCurrentStudent(el);
                    }}
                  >
                    {el.name}
                  </p>
                  <p className="px-3 py-2 sm:w-1/3 text-base sm:text-lg whitespace-nowrap">
                    {el.group}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 px-3 py-2 w-1/3 sm:w-1/2">
                  <p className="sm:w-1/3 text-xl whitespace-nowrap sm:text-lg sm:ml-5 hidden sm:block">
                    {el.respect}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-2/3">
                    <button
                      className="w-full rounded-lg bg-red-400 transition-transform hover:bg-red-600 active:scale-95 hover:scale-105 order-3 sm:order-1"
                      onClick={(_) => {
                        document
                          .getElementById("respect_remove_popup")!
                          .classList.replace("hidden", "flex");
                      }}
                    >
                      <i className="fa fa-minus" aria-hidden="true"></i>
                    </button>
                    <p className="sm:w-1/3 text-xl whitespace-nowrap sm:text-lg sm:ml-5 sm:hidden order-2">
                      {el.respect}
                    </p>
                    <button
                      className="w-full rounded-lg bg-[#7fad75] transition-transform hover:bg-[#4cb834] active:scale-95 hover:scale-105 order-1 sm:order-3"
                      onClick={(_) => {
                        document
                          .getElementById("respect_add_popup")!
                          .classList.replace("hidden", "flex");
                      }}
                    >
                      <i className="fa fa-plus" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default Students;
