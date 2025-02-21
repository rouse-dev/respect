import { useState } from "react";
import GroupPopup from "./add_group";
import LessonPopup from "./add_lesson";
import StudentPopup from "./add_students";
import { useAppContext } from "../../../../store/AppContext";
import SingleStudentPopup from "./add_single_student";

const Add = () => {
  const [isGroupPopup, setIsGroupPopup] = useState(false);
  const [isLessonPopup, setIsLessonPopup] = useState(false);
  const [isStudentPopup, setIsStudentPopup] = useState(false);
  const [isSingleStudentPopup, setIsSingleStudentPopup] = useState(false);

  const {setPopupActive} = useAppContext();

  return (
    <>
    <div
      className="relative cursor-pointer selection:bg-transparent flex flex-row order-3 sm:order-2 justify-end items-center px-5 py-2 rounded-t-lg rounded-b-lg gap-5 bg-[--respect-purple-deep]"
      onClick={(e) => {
        const dropdown = e.currentTarget;
        dropdown.classList.toggle("rounded-b-lg");

        dropdown.querySelector("div")!.classList.contains("hidden")
          ? dropdown.querySelector("div")!.classList.replace("hidden", "flex")
          : dropdown.querySelector("div")!.classList.replace("flex", "hidden");
      }}
    >
      <p className="flex mr-auto">Добавить</p>

      <div className="hidden z-20 flex-col absolute left-0 top-full w-full rounded-b-lg border-[6px] border-t-0 border-[--respect-purple-deep] bg-[--respect-purple]">
          <button className="py-2 hover:backdrop-brightness-110 cursor-pointer" 
            onClick={()=>{
              setIsGroupPopup(true);
              setPopupActive(true);
            }}
          >Группу</button>
          <button className="py-2 hover:backdrop-brightness-110 cursor-pointer" 
            onClick={()=>{
              setIsLessonPopup(true);
              setPopupActive(true);
            }}
          >Предмет</button>
          <button className="py-2 hover:backdrop-brightness-110 cursor-pointer" 
            onClick={()=>{
              setIsSingleStudentPopup(true);
              setPopupActive(true);
            }}
          >Студента</button>
          <button className="py-2 hover:backdrop-brightness-110 cursor-pointer" 
            onClick={()=>{
              setIsStudentPopup(true);
              setPopupActive(true);
            }}
          >Студентов</button>
      </div>
    </div>
    <GroupPopup
      isOpen={isGroupPopup}
      onClose={() => {
        setIsGroupPopup(false);
        setPopupActive(false);
      }}
    />
    <StudentPopup
      isOpen={isStudentPopup}
      onClose={()=>{
        setIsStudentPopup(false);
        setPopupActive(false);
      }}
    />
    <LessonPopup
      isOpen={isLessonPopup}
      onClose={()=>{
        setIsLessonPopup(false);
        setPopupActive(false);
      }}
    />
    <SingleStudentPopup 
      isOpen={isSingleStudentPopup}
      onClose={()=>{
        setIsSingleStudentPopup(false);
        setPopupActive(false);
      }}
    />
    </>
  );
};

export default Add;
