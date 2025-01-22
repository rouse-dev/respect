import { useState } from "react";

const AddPopup = () => {
    const [allSubjects, setAllSubjects] = useState([
        'МДК 09.01',
        'МДК 09.02',
        'МДК 09.03'
    ]);
    const [currentSubject, setCurrentSubject] = useState('');

    return (
        <div id="respect_add_popup" className="hidden justify-center items-center w-full h-[100vh] fixed top-0 left-0 z-50 backdrop-blur-sm">
            <form className="flex flex-col gap-3 bg-[--respect-purple] max-w-72 w-full p-5 m-5 rounded-lg" style={{boxShadow: 'inset 0px 0px 8px 2px var(--respect-purple-dark)'}}>
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
                    <p className="flex mr-auto">{currentSubject || 'Предмет'}</p>
                    <p className="hidden sm:block">|</p>
                    <i className="fa fa-angle-up" aria-hidden="true"></i>

                    <div className="hidden z-20 flex-col absolute left-0 top-full w-full max-h-64 overflow-y-scroll overflow-x-hidden rounded-b-lg border-[6px] border-t-0 border-[--respect-purple-deep] bg-[--respect-purple]">
                        {allSubjects.map((el, i) => 
                            <button className="px-3 py-2 text-left hover:backdrop-brightness-110 last:rounded-b-sm" key={i} onClick={_ => {
                                setCurrentSubject(el);
                            }}>{el}</button>
                        )}
                    </div>
                </div>
                
                <input className="bg-[--respect-purple-deep] outline-none rounded-lg px-3 py-1" type="date" defaultValue={
                    `${new Date().getFullYear()}-${String('0' + Number(new Date().getMonth()) + 1).slice(-2)}-${String('0' + new Date().getDate()).slice(-2)}`
                } required />
                <input className="bg-[--respect-purple-deep] outline-none rounded-lg px-3 py-1" placeholder="Пара" type="number" min={0} required />
                <input className="bg-[--respect-purple-deep] outline-none rounded-lg px-3 py-1" placeholder="Кол-во респекта" type="number" min={0} required />
                <textarea className="bg-[--respect-purple-deep] outline-none rounded-lg px-3 py-1" placeholder="Причина" required />

                <button className="bg-[--respect-purple-dark] p-3 rounded-lg mt-2" type="submit">Добавить</button>
                <button className="bg-[--respect-purple-dark] p-3 rounded-lg" type="button" onClick={e => {
                    e.currentTarget.parentElement!.parentElement!.classList.replace('flex', 'hidden');
                }}>Отмена</button>
            </form>
        </div>
        
    )
}

export default AddPopup;