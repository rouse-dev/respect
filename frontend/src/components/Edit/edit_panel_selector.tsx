import { FaUser, FaUsers } from "react-icons/fa";
import { ImBook } from "react-icons/im";

interface EditPanelSelectorInterface {
    setMode: (arg: string) => void
}

const EditPanelSelector = ({setMode}: EditPanelSelectorInterface) => {
    return (
        <div className="relative max-w-3xl w-full mx-auto p-3 rounded-md flex flex-row gap-3 bg-[--respect-purple-deep]">
            <div className="absolute transition-transform h-[calc(100%-24px)] w-[calc(100%/3-1rem)] bg-[--respect-purple-dark] rounded-md z-0" />
            {['Группы', 'Студенты', 'Предметы'].map((el, i) => 
                <button key={i} className="flex flex-row items-center justify-center gap-3 w-full text-center py-3 z-10 rounded-md transition-[backdrop-filter] hover:backdrop-brightness-125" onClick={e => {
                    setMode(el);
                    e.currentTarget.parentElement!.querySelector('div')!.style.transform = 'translate(calc(' + i * 100 + '% + ' + i * 0.75 + 'rem))';
                }}>{i === 0 && <FaUsers className="text-2xl" />} {i === 1 && <FaUser className="text-2xl" />} {i === 2 && <ImBook className="text-2xl" />} <p className="hidden sm:block">{el}</p></button>
            )}
        </div>
    )
}

export default EditPanelSelector;