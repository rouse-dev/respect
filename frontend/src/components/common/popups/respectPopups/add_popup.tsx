import { useEffect, useState } from "react";
import Preloader from "../../preloader/preloader";
import { toast } from "react-toastify";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { Student } from "../../../../interfaces/student";
import { Subject } from "../../../../interfaces/subject";
import { ChangeRespectAdd, getLessons } from "../../../../service/teacher";

interface AddPopupProps {
  student: Student;
  onClose: () => void;
  isOpen: boolean;
}

const AddPopup = ({ student, onClose, isOpen }: AddPopupProps) => {
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
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
  const [currentSubject, setCurrentSubject] = useState<Subject>({
    id: 0,
    name: "",
  });
  const [amount, setAmount] = useState(Number);
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString().split(".").reverse().join("-"));
  const [lesson, setLesson] = useState(Number);
  const [isLoading, setIsLoading] = useState(false);
  const [isLessonNew, setIsLessonNew] = useState(false);
  const [newLesson, setNewLesson] = useState("");
  const [dropdown, setDropdown] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!currentSubject) {
      toast.info("Пожалуйста, выберите предмет");
      return;
    }

    setIsLoading(true);
    try {
      const result = await ChangeRespectAdd({
        date:date,
        class:lesson,
        studentId: student.id,
        change: amount,
        reason: reason,
        lessonId: +currentSubject.id,
        newLesson: newLesson,
      });

      if (result.succes) {
        toast.success("Репутация прибавлена на " + amount);
        onClose();
      } else {
        toast.error('Выберите предмет');
      }
    } catch (error) {
      console.error("Ошибка при изменении репутации:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {isLoading && <Preloader />}
      <div
        id="respect_add_popup"
        className="flex justify-center items-center w-full h-[100vh] fixed top-0 left-0 z-50 backdrop-blur"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 bg-[--respect-purple] max-w-80 w-full p-5 m-5 rounded-lg"
          style={{
            boxShadow: "inset 0px 0px 8px 2px var(--respect-purple-dark)",
          }}
        >
          <div
            className="relative cursor-pointer selection:bg-transparent flex flex-row justify-end items-center px-4 py-1 rounded-t-lg rounded-b-lg gap-5 bg-[--respect-purple-deep]"
            onClick={(e) => {
              const dropdown = e.currentTarget;
              dropdown.classList.toggle("rounded-b-lg");

              setDropdown(dropdown.querySelector("div")!.classList.contains("hidden"));
              dropdown.querySelector("div")!.classList.contains("hidden")
                ? dropdown
                    .querySelector("div")!
                    .classList.replace("hidden", "flex")
                : dropdown
                    .querySelector("div")!
                    .classList.replace("flex", "hidden");
            }}
          >
            <p className="flex mr-auto">{currentSubject.name || "Предмет"}</p>
            <p className="hidden sm:block">|</p>
            {dropdown ? <FaAngleDown /> : <FaAngleUp />}

            <div className="hidden z-20 flex-col absolute left-0 top-full w-full max-h-64 overflow-y-scroll overflow-x-hidden rounded-b-lg border-[6px] border-t-0 border-[--respect-purple-deep] bg-[--respect-purple]">
              {allSubjects.map((el, i) => (
                <button
                  type="button"
                  className="px-3 cursor-pointer py-2 text-left hover:backdrop-brightness-110 last:rounded-b-sm"
                  key={i}
                  onClick={(_) => {
                    setCurrentSubject(el);
                    setIsLessonNew(false);
                    setNewLesson("");
                  }}
                >
                  {el.name}
                </button>
              ))}
              <button
                className="px-3 cursor-pointer py-2 hover:backdrop-brightness-110 last:rounded-b-sm"
                type="button"
                onClick={() => {
                  setIsLessonNew(true);
                  setCurrentSubject({ id: -1, name: "- новый предмет -" });
                }}
              >
                - новый предмет -
              </button>
            </div>
          </div>

          {isLessonNew && (
            <input
              type="text"
              className="bg-[--respect-purple-deep] outline-hidden rounded-lg px-3 py-1"
              onChange={(el) => setNewLesson(el.target.value)}
              placeholder="Название предмета"
            />
          )}
          <input
            className="bg-[--respect-purple-deep] cursor-pointer outline-hidden rounded-lg px-3 py-1"
            type="date"
            defaultValue={date}
            max={new Date().toLocaleDateString().split('.').reverse().join('-')}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            className="bg-[--respect-purple-deep] outline-hidden rounded-lg px-3 py-1"
            placeholder="Пара"
            type="text"
            onChange={(e) => {
              if (isNaN(+e.target.value)) {
                e.target.value = e.target.value.slice(
                  0, e.target.value.length - 2
                );
                return;
              } else {
                e.target.value = e.target.value.slice(-1);
              };
              setLesson(+e.target.value);
            }}
            required
          />
          <input
            className="bg-[--respect-purple-deep] outline-hidden rounded-lg px-3 py-1"
            placeholder="Кол-во респекта"
            type="text"
            onChange={(e) => {
              if (isNaN(+e.target.value)) {
                e.target.value = e.target.value.slice(
                  0,
                  e.target.value.length - 2
                );
                return;
              }
              setAmount(parseInt(e.target.value));
            }}
            required
          />
          <textarea
            className="bg-[--respect-purple-deep] outline-hidden rounded-lg px-3 py-1"
            placeholder="Причина"
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <button
            className="bg-[--respect-purple-dark] cursor-pointer p-3 rounded-lg mt-2"
            type="submit"
          >
            Добавить
          </button>
          <button
            className="bg-[--respect-purple-dark] cursor-pointer p-3 rounded-lg"
            type="button"
            onClick={onClose}
          >
            Отмена
          </button>
        </form>
      </div>
    </>
  );
};

export default AddPopup;
