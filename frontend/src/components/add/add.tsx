import { useState } from "react";
import GroupPopup from "./add_group";
import LessonPopup from "./add_lesson";
import StudentPopup from "./add_students";

const Add = () => {
  const [isVisible, setIsVisible] = useState(false);

  const [isGroupPopup, setIsGroupPopup] = useState(false);
  const [isLessonPopup,setIsLessonPopup] = useState(false);
  const [isStudentPopup,setIsStudentPopup] = useState(false)

  const HandleVisible = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="absolute z-20">
      <div
        className="w-[130px] flex justify-center bg-[--respect-purple-deep] text-lg cursor-pointer p-[8px] rounded-t-lg rounded-b-lg"
        onClick={HandleVisible}
      >
        Добавить
      </div>
      <div
        className={`w-[270px] gap-3 mt-3 flex flex-col items-center justify-center p-[8px] rounded-t-lg rounded-b-lg bg-[--respect-purple-deep] px-5 ${
          isVisible ? "" : "hidden"
        }`}
      >
        <div onClick={()=>setIsGroupPopup(true)} className="h-[40px] bg-[--respect-purple-dark] w-full flex items-center justify-center rounded-lg cursor-pointer">
          Добавить группу
        </div>
        <GroupPopup
          isOpen={isGroupPopup}
          onClose={() => {
            setIsGroupPopup(false);
          }}
        />
        <div onClick={()=>setIsStudentPopup(true)} className="h-[40px] bg-[--respect-purple-dark] w-full flex items-center justify-center rounded-lg cursor-pointer">
          Добавить студента
        </div>
        <StudentPopup
        isOpen={isStudentPopup}
        onClose={()=>setIsStudentPopup(false)}
        />
        <div onClick={()=>setIsLessonPopup(true)} className="h-[40px] bg-[--respect-purple-dark] w-full flex items-center justify-center rounded-lg cursor-pointer">
          Добавить предмет
        </div>
        <LessonPopup
        isOpen={isLessonPopup}
        onClose={()=>setIsLessonPopup(false)}
        />
      </div>
    </div>
  );
};

export default Add;
