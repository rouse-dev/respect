import { useAppContext } from "../store/AppContext";
import { useEffect, useState } from "react";
import { GetAllStudents } from "../service/server";
import Preloader from "./preloader";
import AddPopup from "./add_popup";
import HistoryPopup from "./History/history_popup";
import RemovePopup from "./remove_popup";
import DiscardPopup from "./discard_popup";

const Students = () => {
  const {
    search,
    currentStudent,
    currentGroup,
    currentSortMethod,
    sortDirection,
    students,
    sortedStudents,
    setStudents,
    setSortedStudents
  } = useAppContext();
  const [isLoading, setLoading] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false);
  const [isRemovePopupOpen, setIsRemovePopupOpen] = useState(false);
  const [isDiscardPopupOpen, setIsDiscardPopupOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState<string | null>(null);


  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await GetAllStudents();
      if (response.succes && response.data) {
        setStudents(response.data)
        setSortedStudents(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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

  useEffect(() => {
    const popupElement = document.getElementById("respect_history_popup");

    if (popupElement) {
      if (!currentStudent || Object.keys(currentStudent).length === 0) {
        popupElement.classList.replace("flex", "hidden");
      } else {
        popupElement.classList.replace("hidden", "flex");
      }
    }
  }, [currentStudent]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
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
          {sortedStudents.length === 0 && <div className="text-center font-bold">Ничего не найдено!</div>}
          {sortedStudents.map((el) => {
            const show =
              search.length === 0 ||
              el.name?.toLowerCase().includes(search.toLowerCase(), 0);
            if (show)
              return (
                <div
                  key={el.id}
                  className={`flex flex-row bg-[--respect-purple] rounded-lg py-1`}
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:gap-5 w-2/3 sm:w-1/2">
                    <p
                      className="px-3 py-2 w-2/3 text-xl sm:text-lg cursor-pointer hover:underline active:"
                      onClick={() => {
                        console.log(sortedStudents)
                        setSelectedStudentId(el.id);
                        setSelectedStudentName(el.name);
                        setIsHistoryPopupOpen(true);
                      }}
                    >
                      {el.name}
                    </p>
                    <p className="px-3 py-2 sm:w-1/3 flex items-center text-base sm:text-lg whitespace-nowrap">
                      {el.groups.name}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 px-3 py-2 w-1/3 sm:w-1/2">
                    <p className="sm:w-1/3 text-xl whitespace-nowrap sm:text-lg sm:ml-5 hidden sm:block">
                      {el.reputation}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-2/3">
                      <button
                        className="w-full rounded-lg bg-red-400 transition-transform hover:bg-red-600 active:scale-95 hover:scale-105 order-2 sm:order-2"
                        onClick={() => {
                          setSelectedStudentId(el.id);
                          setIsRemovePopupOpen(true);
                        }}
                      >
                        <i className="fa fa-minus" aria-hidden="true"></i>
                      </button>

                      <p className="sm:w-1/3 text-xl whitespace-nowrap sm:text-lg sm:ml-5 sm:hidden order-2">
                        {el.reputation}
                      </p>

                      <button
                        className="w-full rounded-lg bg-[#7fad75] transition-transform hover:bg-[#4cb834] active:scale-95 hover:scale-105 order-1 sm:order-1"
                        onClick={() => {
                          setSelectedStudentId(el.id);
                          setIsAddPopupOpen(true);
                        }}
                      >
                        <i className="fa fa-plus" aria-hidden="true"></i>
                      </button>

                      <button
                        className="w-full rounded-lg bg-[#6f8abc] transition-transform hover:bg-[#4c6fb0] active:scale-95 hover:scale-105 order-3 sm:order-3"
                        onClick={() => {
                          setSelectedStudentId(el.id);
                          setIsDiscardPopupOpen(true);
                        }}
                      >
                        <i className="fa fa-check" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
          })}
        </div>
      </div>

      <AddPopup
        studentId={selectedStudentId || 0}
        isOpen={isAddPopupOpen}
        onClose={() => {
          setIsAddPopupOpen(false);
          setSelectedStudentId(null);
          fetchStudents();
        }}
      />

      <HistoryPopup
        studentId={selectedStudentId || 0}
        name={selectedStudentName || 'noname'}
        isOpen={isHistoryPopupOpen}
        onClose={() => {
          setIsHistoryPopupOpen(false);
          setSelectedStudentId(null);
        }}
      />

      <RemovePopup
        studentId={selectedStudentId || 0}
        isOpen={isRemovePopupOpen}
        onClose={() => {
          setIsRemovePopupOpen(false);
          setSelectedStudentId(null);
          fetchStudents();
        }}
      />
      <DiscardPopup
        studentId={selectedStudentId || 0}
        isOpen={isDiscardPopupOpen}
        onClose={() => {
          setIsDiscardPopupOpen(false);
          setSelectedStudentId(null);
          fetchStudents();
        }}
      />
    </>
  );
};

export default Students;
