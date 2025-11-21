import { FaChalkboardTeacher, FaUsers } from "react-icons/fa";
import { ImBook } from "react-icons/im";
import editMode from "../../types/edit_mode";
import { PiStudentBold } from "react-icons/pi";

interface EditPanelSelectorInterface {
    setMode: (arg: editMode) => void
}

const EditPanelSelector = ({setMode}: EditPanelSelectorInterface) => {
    const modes: editMode[] = ['Группы', 'Студенты', 'Предметы', 'Пользователи'];

    return (
        <div className="relative max-w-3xl w-full mx-auto p-3 rounded-md flex flex-row gap-3 bg-[--respect-purple-deep]">
            <div className="absolute transition-transform h-[calc(100%-24px)] w-[calc(100%/4-1rem)] bg-[--respect-purple-dark] rounded-md z-0" />
            {modes.map((el, i) =>
                <button key={i} className="flex flex-row items-center justify-center gap-3 w-full text-center py-3 z-10 rounded-md transition-[backdrop-filter] hover:backdrop-brightness-125" onClick={e => {
                    setMode(el);
                    e.currentTarget.parentElement!.querySelector('div')!.style.transform = 'translate(calc(' + i * 100 + '% + ' + i * 0.75 + 'rem))';
                }}>{{
                    'Группы': <FaUsers className="text-2xl" />,
                    'Студенты': <PiStudentBold className="text-2xl" />,
                    'Предметы': <ImBook className="text-2xl" />,
                    'Пользователи': <FaChalkboardTeacher className="text-2xl" />
                }[el]} <p className="hidden sm:block">{el}</p></button>
            )}
        </div>
    )
}

export default EditPanelSelector;