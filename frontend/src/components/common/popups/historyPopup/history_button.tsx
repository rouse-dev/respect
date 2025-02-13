import { useState } from "react";
import { Student, useAppContext } from "../../../../store/AppContext";
import HistoryPopup from "./history_popup";
import { FaCrown } from "react-icons/fa";

interface HistoryButtonInterface {
    student: Student
}

const HistoryButton = ({ student }: HistoryButtonInterface) => {
    const {setPopupActive, sortedStudents} = useAppContext();
    const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false);

    return (
        <>
        <button
            className="text-left px-3 py-2 w-full sm:w-2/3 text-xl sm:text-lg hover:underline flex flex-col sm:flex-row justify-self-start gap-3"
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