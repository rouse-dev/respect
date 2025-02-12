import { useState } from "react";
import { Student, useAppContext } from "../../../../store/AppContext";
import HistoryPopup from "./history_popup";

interface HistoryButtonInterface {
    student: Student
}

const HistoryButton = ({ student }: HistoryButtonInterface) => {
    const {setPopupActive} = useAppContext();
    const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false);

    return (
        <>
        <button
            className="text-left px-3 py-2 w-2/3 text-xl sm:text-lg hover:underline"
            onClick={() => {
                setPopupActive(true);
                setIsHistoryPopupOpen(true);
            }}
        >
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