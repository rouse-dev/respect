import { useState } from "react";
import HistoryPopup from "./history_popup";
import { FaCrown } from "react-icons/fa";
import { Student } from "../../../../interfaces/student";
import useStudentStore from "../../../../store/studentStore";
import usePopupStore from "../../../../store/popupStore";

interface HistoryButtonInterface {
    student: Student
}

const HistoryButton = ({ student }: HistoryButtonInterface) => {
    const {setPopupActive} = usePopupStore();
    const { sortedStudents } = useStudentStore();
    const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false);

    return (
        <>
        <button
            className="text-left cursor-pointer px-3 py-2 w-full sm:w-2/3 text-xl sm:text-lg hover:underline flex flex-col sm:flex-row justify-self-start gap-3"
            onClick={() => {
                setPopupActive(true);
                setIsHistoryPopupOpen(true);
            }}
        >
            {(sortedStudents.sort((a, b) => b.reputation - a.reputation)[0].id === student.id) && <FaCrown className="text-yellow-400 mr-auto sm:mr-0 self-center"/>}
            {student.name}
        </button>
        <HistoryPopup
            student={student}
            isOpen={isHistoryPopupOpen}
            onClose={() => {
                setIsHistoryPopupOpen(false);
                setPopupActive(false);
            }}
        />
        </>
    )
}

export default HistoryButton;