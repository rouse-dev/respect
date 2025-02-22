import { useState } from "react";
import { addLesson } from "../../../../service/server";
import { LessonInterface, useAppContext } from "../../../../store/AppContext";

interface AddLessonPopup{
    onClose:()=>void;
    isOpen: boolean;
}

const LessonPopup = ({ isOpen, onClose }:AddLessonPopup)=>{
  const [loading, setLoading] = useState(false);
  const [newLesson, setLesson] = useState('');
  const {lessons, setLessons} = useAppContext();

  const addLessonFunc = async () => {
    try {
      setLoading(true);
      addLesson(newLesson).then((response: LessonInterface) => {
        setLessons([...lessons, response]);
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const sender = () => {
    try {
      addLessonFunc();
      (newLesson.length > 0) && onClose();
    } catch (error) {
      console.error(error)
    }
  }
  
    if(!isOpen) return null

    return(
        <>
         <div className="flex  flex-col justify-center items-center w-full h-[100vh] fixed top-0 left-0 z-50 backdrop-blur">
        <form
          onSubmit={e => e.preventDefault()}
          className="w-[300px] h-[180px] bg-[--respect-purple-deep] flex flex-col items-center justify-center p-5 rounded-lg gap-3"
        >
          <input
            className="sm:max-w-xs w-full bg-[--respect-purple-add-inputs] rounded-lg py-2 pl-3 outline-hidden"
            placeholder="Название предмета"
            onChange={(txt) => {setLesson(txt.target.value)}}
            type="text"
          />
          <button onClick={sender} disabled={loading} className="h-[40px] bg-[--respect-purple-dark] w-full flex items-center justify-center rounded-lg cursor-pointer">
            Добавить
          </button>
          <button onClick={onClose} disabled={loading} className="h-[40px] bg-[--respect-purple-dark] w-full flex items-center justify-center rounded-lg cursor-pointer">
            Отмена
          </button>
        </form>
      </div>
        </>
    )
}
export default LessonPopup