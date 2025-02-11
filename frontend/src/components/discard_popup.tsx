import { useEffect, useState } from "react";
import { ChangeRespect, getLessons } from "../service/server";
import Preloader from "./preloader";
import { Subject } from "../store/AppContext";
import { toast } from "react-toastify";

interface RemovePopupProps {
  studentId: number;
  onClose: () => void;
  isOpen: boolean;
}

const DiscardPopup = ({ studentId, onClose, isOpen }: RemovePopupProps) => {
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  useEffect(() => {
    async function getAllLessons() {
      try {
        const response = await getLessons();
        setAllSubjects(response);
      } catch (error) {
        console.log(error);
      }
    }
    isOpen && getAllLessons();
  }, [isOpen]);

  const [currentSubject, setCurrentSubject] = useState<Subject>({
    id: 0,
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(1);
  const [isLessonNew, setIsLessonNew] = useState(false);
  const [newLesson, setNewLesson] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const selectedOption = form.querySelector(
      'input[name="respect_remove_radio"]:checked'
    ) as HTMLInputElement;

    if (!selectedOption) {
      alert("Пожалуйста, выберите причину списания");
      return;
    }

    let deduction = 0;
    let reason = "";

    switch (selectedOption.id) {
      case "propusk":
        deduction = -100;
        reason = "Пропуск";
        break;
      case "skip_para":
        deduction = -150;
        reason = "Прогул";
        break;
      case "dolg":
        deduction = -50 * amount;
        reason = `Снятие долга (${amount} шт.)`;
        break;
    }

    setIsLoading(true);
    try {
      const result = await ChangeRespect({
        studentId,
        change: deduction,
        reason,
        lessonId: +currentSubject.id,
        newLesson: newLesson,
      });
      if (result.succes) {
        toast("Долг списан");
        onClose();
      } else {
        alert(result.error);
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
        id="respect_remove_popup"
        className="flex justify-center items-center w-full h-[100vh] fixed top-0 left-0 z-50 backdrop-blur-sm"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 bg-[--respect-purple] max-w-72 w-full p-5 m-5 rounded-lg"
          style={{
            boxShadow: "inset 0px 0px 8px 2px var(--respect-purple-dark)",
          }}
        >
          <div
            className="relative cursor-pointer selection:bg-transparent flex flex-row justify-end items-center px-3 py-1 rounded-t-lg rounded-b-lg gap-5 bg-[--respect-purple-deep]"
            onClick={(e) => {
              const dropdown = e.currentTarget;
              dropdown.classList.toggle("rounded-b-lg");

              dropdown.querySelector("div")!.classList.contains("hidden")
                ? dropdown
                    .querySelector("div")!
                    .classList.replace("hidden", "flex")
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
            <p className="flex mr-auto">{currentSubject.name || "Предмет"}</p>
            <p className="hidden sm:block">|</p>
            <i className="fa fa-angle-up" aria-hidden="true"></i>

            <div className="hidden z-20 flex-col absolute left-0 top-full w-full max-h-64 overflow-y-scroll overflow-x-hidden rounded-b-lg border-[6px] border-t-0 border-[--respect-purple-deep] bg-[--respect-purple]">
              {allSubjects.map((el, i) => (
                <button
                  type="button"
                  className="px-3 py-2 text-left hover:backdrop-brightness-110 last:rounded-b-sm"
                  key={i}
                  onClick={(_) => {
                    setCurrentSubject(el);
                  }}
                >
                  {el.name}
                </button>
              ))}
              <button
                className="px-3 py-2 hover:backdrop-brightness-110 last:rounded-b-sm"
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
              className="bg-[--respect-purple-deep] outline-none rounded-lg px-3 py-1"
              placeholder="Название предмета"
              onChange={(el) => setNewLesson(el.target.value)}
            />
          )}
          <div
            className="cursor-pointer flex flex-row items-center gap-3 bg-[--respect-purple-deep] rounded-lg px-3 py-1"
            onClick={(e) => {
              const button = e.currentTarget;
              const input = button.querySelector(
                "input[type=radio]"
              ) as HTMLElement;
              input.click();
            }}
          >
            <input
              className="hidden peer"
              type="radio"
              name="respect_remove_radio"
              id="propusk"
              required
            />
            <div className="min-w-4 h-4 rounded-[100%] peer-checked:bg-white bg-[--respect-purple-dark]"></div>
            <p>Пропуск (-100)</p>
          </div>
          <div
            className="cursor-pointer flex flex-row items-center gap-3 bg-[--respect-purple-deep] rounded-lg px-3 py-1"
            onClick={(e) => {
              const button = e.currentTarget;
              const input = button.querySelector(
                "input[type=radio]"
              ) as HTMLElement;
              input.click();
            }}
          >
            <input
              className="hidden peer"
              type="radio"
              name="respect_remove_radio"
              id="skip_para"
              required
            />
            <div className="min-w-4 h-4 rounded-[100%] peer-checked:bg-white bg-[--respect-purple-dark]"></div>
            <p>Прогул (-150)</p>
          </div>
          <div
            className="cursor-pointer flex flex-row items-center gap-3 bg-[--respect-purple-deep] rounded-lg px-3 py-1"
            onClick={(e) => {
              const button = e.currentTarget;
              const input = button.querySelector(
                "input[type=radio]"
              ) as HTMLElement;
              input.click();
            }}
          >
            <input
              className="hidden peer"
              type="radio"
              name="respect_remove_radio"
              id="dolg"
              required
            />
            <div className="min-w-4 h-4 rounded-[100%] peer-checked:bg-white bg-[--respect-purple-dark]"></div>
            <p>Снятие долга (-50)</p>
            <input
              className="block ml-auto -mr-2 pl-3 w-16 outline-none bg-[--respect-purple-dark] rounded-lg"
              type="number"
              min="1"
              value={amount}
              onChange={(e) =>
                setAmount(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
          </div>

          <button
            className="bg-[--respect-purple-dark] p-3 rounded-lg mt-2"
            type="submit"
          >
            Списать
          </button>
          <button
            className="bg-[--respect-purple-dark] p-3 rounded-lg"
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

export default DiscardPopup;
