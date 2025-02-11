import { useEffect, useState } from "react";
import { ChangeRespect, getLessons } from "../service/server";
import Preloader from "./preloader";
import { Subject } from "../store/AppContext";
import { toast } from "react-toastify";

interface AddPopupProps {
  studentId: number;
  onClose: () => void;
  isOpen: boolean;
}

const AddPopup = ({ studentId, onClose, isOpen }: AddPopupProps) => {
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    useEffect(() => {
        async function getAllLessons() {
            try {
                const response = await getLessons();
                setAllSubjects(response)
               
            } catch (error) {
                console.log(error)
            }
        }
        isOpen && getAllLessons();
    }, [isOpen])
    const [currentSubject, setCurrentSubject] = useState<Subject>({id: 0, name: ''});
    const [amount, setAmount] = useState(Number);// type number но из-за этого не показывает в начале placholder
    const [reason, setReason] = useState('');
    const [date, setDate] = useState(new Date().toLocaleDateString().split('.').reverse().join('-'));
    const [lesson, setLesson] = useState(Number); // type number но из-за этого не показывает в начале placholder
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!currentSubject) {
            alert('Пожалуйста, выберите предмет');
            return;
        }

        setIsLoading(true);
        try {
         
            const fullReason = `${currentSubject.name}, Пара ${lesson}: ${reason}`;
            const result = await ChangeRespect({
                studentId,
                change: amount,
                reason: fullReason,
                lessonId: +currentSubject.id,
            });

            if (result.succes) {
                toast.success('Репутация прибавлена на '+amount)
                onClose();   
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Ошибка при изменении репутации:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {isLoading && <Preloader />}
            <div id="respect_add_popup" className="flex justify-center items-center w-full h-[100vh] fixed top-0 left-0 z-50 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-[--respect-purple] max-w-72 w-full p-5 m-5 rounded-lg" style={{boxShadow: 'inset 0px 0px 8px 2px var(--respect-purple-dark)'}}>
                    <div className="relative cursor-pointer selection:bg-transparent flex flex-row justify-end items-center px-3 py-1 rounded-t-lg rounded-b-lg gap-5 bg-[--respect-purple-deep]" onClick={e => {
                        const dropdown = e.currentTarget;
                        dropdown.classList.toggle('rounded-b-lg');

                        dropdown.querySelector('div')!.classList.contains('hidden')?
                        dropdown.querySelector('div')!.classList.replace('hidden', 'flex'):
                        dropdown.querySelector('div')!.classList.replace('flex', 'hidden');

                        dropdown.querySelector('i')!.classList.contains('fa-angle-down')?
                        dropdown.querySelector('i')!.classList.replace('fa-angle-down', 'fa-angle-up'):
                        dropdown.querySelector('i')!.classList.replace('fa-angle-up', 'fa-angle-down');
                    }}>
                        <p className="flex mr-auto">{currentSubject.name || 'Предмет'}</p>
                        <p className="hidden sm:block">|</p>
                        <i className="fa fa-angle-up" aria-hidden="true"></i>

                        <div className="hidden z-20 flex-col absolute left-0 top-full w-full max-h-64 overflow-y-scroll overflow-x-hidden rounded-b-lg border-[6px] border-t-0 border-[--respect-purple-deep] bg-[--respect-purple]">
                            {allSubjects.map((el, i) => 
                                <button type="button" className="px-3 py-2 text-left hover:backdrop-brightness-110 last:rounded-b-sm" key={i} onClick={_ => {
                                    setCurrentSubject(el);
                                }}>{el.name}</button>
                            )}
                        </div>
                    </div>
                    
                    <input 
                        className="bg-[--respect-purple-deep] outline-none rounded-lg px-3 py-1" 
                        type="date" 
                        defaultValue={date}
                        max={date}
                        onChange={(e) => setDate(e.target.value)}
                        required 
                    />
                    <input 
                        className="bg-[--respect-purple-deep] outline-none rounded-lg px-3 py-1" 
                        placeholder="Пара" 
                        type="text" 
                        min={0}
                        onChange={(e) => {
                            if (isNaN(+e.target.value)) {
                                e.target.value = e.target.value.slice(0, e.target.value.length - 2);
                                return
                            };
                            setLesson(+e.target.value);
                        }}
                        required 
                    />
                    <input 
                        className="bg-[--respect-purple-deep] outline-none rounded-lg px-3 py-1" 
                        placeholder="Кол-во респекта" 
                        type="text"
                        onChange={(e) => {
                            if (isNaN(+e.target.value)) {
                                e.target.value = e.target.value.slice(0, e.target.value.length - 2);
                                return
                            };
                            setAmount(parseInt(e.target.value));
                        }}
                        required 
                        min="0"
                    />
                    <textarea 
                        className="bg-[--respect-purple-deep] outline-none rounded-lg px-3 py-1" 
                        placeholder="Причина"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required 
                    />

                    <button className="bg-[--respect-purple-dark] p-3 rounded-lg mt-2" type="submit">
                        Добавить
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

export default AddPopup;