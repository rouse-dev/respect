import { useAppContext } from "../../store/AppContext";
import { useEffect, useState } from "react";
import { GetAllStudents } from "../../service/server";
import Preloader from "../common/preloader/preloader";
import RespectButtons from "../common/popups/respectPopups/respect_buttons";
import HistoryButton from "../common/popups/historyPopup/history_button";
import { TbMoodSad } from "react-icons/tb";

const Students = () => {
  const { search, currentStudent, sortedStudents, setStudents, setSortedStudents,popupElementRef } = useAppContext();
  const [isLoading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await GetAllStudents();
      if (response.succes && response.data) {
        setStudents(response.data)
        setSortedStudents(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    
   

    if (popupElementRef.current) {
      if (!currentStudent || Object.keys(currentStudent).length === 0) {
        popupElementRef.current.classList.replace("flex", "hidden");
      } else {
        popupElementRef.current.classList.replace("hidden", "flex");
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
          <p className="rounded-lg text-center px-2 py-1 bg-[--respect-purple-dark] w-1/3 overflow-hidden text-ellipsis">
            Респект
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {sortedStudents.length === 0 && <div className="text-center font-bold flex flex-row items-center justify-center gap-2 "><TbMoodSad /> Ничего не найдено!</div>}
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
                    <HistoryButton student={el} />
                    <p className="px-3 py-2 sm:w-1/3 flex items-center text-base sm:text-lg whitespace-nowrap">
                      {el.groups.name}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 px-3 py-2 w-1/3 sm:w-1/2">
                    <p className="sm:w-1/3 text-xl whitespace-nowrap sm:text-lg sm:ml-5 hidden sm:block">
                      {el.reputation}
                    </p>
                    <RespectButtons student={el} fetchStudents={fetchStudents} />
                  </div>
                </div>
              );
          })}
        </div>
      </div>
    </>
  );
};

export default Students;
