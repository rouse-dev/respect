import { useState } from "react";
import { Student, useAppContext } from "../../../../store/AppContext";
import AddPopup from "./add_popup";
import DiscardPopup from "./discard_popup";
import RemovePopup from "./remove_popup";

interface RespectButtonsInterface {
    student: Student,
    fetchStudents: () => void
}

const RespectButtons = ({ student, fetchStudents }: RespectButtonsInterface) => {
    const {setPopupActive} = useAppContext();

    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isRemovePopupOpen, setIsRemovePopupOpen] = useState(false);
    const [isDiscardPopupOpen, setIsDiscardPopupOpen] = useState(false);
    return (
        <>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-2/3">
            <button
            className="w-full rounded-lg bg-red-400 transition-transform hover:bg-red-600 active:scale-95 hover:scale-105 order-2 sm:order-2"
            onClick={() => {
                setPopupActive(true);
                setIsRemovePopupOpen(true);
            }}
            >
            <i className="fa fa-minus" aria-hidden="true"></i>
            </button>

            <p className="sm:w-1/3 text-xl whitespace-nowrap sm:text-lg sm:ml-5 sm:hidden order-2">
            {student.reputation}
            </p>

            <button
            className="w-full rounded-lg bg-[#7fad75] transition-transform hover:bg-[#4cb834] active:scale-95 hover:scale-105 order-1 sm:order-1"
            onClick={() => {
                setPopupActive(true);
                setIsAddPopupOpen(true);
            }}
            >
            <i className="fa fa-plus" aria-hidden="true"></i>
            </button>

            <button
            className="w-full rounded-lg bg-[#6f8abc] transition-transform hover:bg-[#4c6fb0] active:scale-95 hover:scale-105 order-3 sm:order-3"
            onClick={() => {
                setPopupActive(true);
                setIsDiscardPopupOpen(true);
            }}
            >
            <i className="fa fa-check" aria-hidden="true"></i>
            </button>
        </div>
        <AddPopup
            student={student}
            isOpen={isAddPopupOpen}
            onClose={() => {
                setIsAddPopupOpen(false);
                fetchStudents();
                setPopupActive(false);
            }}
        />
        <RemovePopup
            student={student}
            isOpen={isRemovePopupOpen}
            onClose={() => {
                setIsRemovePopupOpen(false);
                fetchStudents();
                setPopupActive(false);
            }}
        />
        <DiscardPopup
            student={student}
            isOpen={isDiscardPopupOpen}
            onClose={() => {
                setIsDiscardPopupOpen(false);
                fetchStudents();
                setPopupActive(false);
            }}
        />
        </>
    )
}

export default RespectButtons;