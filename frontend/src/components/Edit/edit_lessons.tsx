import { useEffect, useState } from "react";
import { FaEdit, FaRegPlusSquare, FaTrashAlt } from "react-icons/fa";
import { getLessons } from "../../service/server";
import { Subject, useAppContext } from "../../store/AppContext";
import LessonPopup from "../common/popups/addPopups/add_lesson";

interface EditLessonsInterface {
  isOpen: boolean;
}

const EditLessons = ({ isOpen }: EditLessonsInterface) => {
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [isLessonPopup, setIsLessonPopup] = useState(false);

  const { setPopupActive } = useAppContext();

  useEffect(() => {
    async function getAllLessons() {
      try {
        const response = await getLessons();
        setAllSubjects(response);
      } catch (error) {
        console.error(error);
      }
    }
    isOpen && getAllLessons();
  }, [isOpen]);
  return (
    <div
      className={`${
        isOpen ? "max-w-full px-3 sm:px-5" : "max-w-0 max-h-0"
      } overflow-hidden transition-[max-width_max-height] py-3 sm:py-5 w-full flex flex-col gap-5 text-lg bg-[--respect-purple-deep] rounded-md`}
    >
      <input
        className={`placeholder:text-[#8e8e8e] outline-none w-full bg-[--respect-purple-dark] rounded-lg py-2 pl-3 pr-9 outline-hidden ${
          search.length
            ? "bg-[url(./assets/media/lypa-white.svg)]"
            : "bg-[url(./assets/media/lypa-grey.svg)]"
        } bg-no-repeat bg-[calc(100%-8px)_center] bg-[24px_auto]`}
        placeholder="Поиск..."
        type="text"
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        onClick={() => {
          setIsLessonPopup(true);
          setPopupActive(true);
        }}
        className="flex flex-row justify-center items-center gap-3 p-3 bg-[--respect-purple-dark] rounded-md transition-shadow hover:shadow-[0px_0px_5px_var(--respect-purple-light)]"
      >
        <p className="hidden sm:block">Создать</p>
        <FaRegPlusSquare />
      </button>

      {allSubjects.map((subject) => (
        <div
          key={subject.id}
          className={`${
            isOpen ? "scale-y-100" : "scale-y-0"
          } transition-transform flex flex-col md:flex-row justify-between items-center gap-3 p-3 shadow-[inset_0px_0px_24px_var(--respect-purple-dark)] rounded-md text-xl`}
        >
          <p className="py-2 sm:py-0">{subject.name}</p>
          <div className="w-full md:w-fit flex flex-row gap-3">
            <button className="w-full md:w-fit p-3 rounded-md bg-amber-600 hover:bg-amber-500">
              <FaEdit className="mx-auto" />
            </button>
            <button className="w-full md:w-fit p-3 rounded-md bg-red-500 hover:bg-rose-600">
              <FaTrashAlt className="mx-auto" />
            </button>
          </div>
        </div>
      ))}
      <LessonPopup
        isOpen={isLessonPopup}
        onClose={() => {
          setIsLessonPopup(false);
          setPopupActive(false);
        }}
      />
    </div>
  );
};

export default EditLessons;
