const AddPopup = () => {
    return (
        <div id="respect_add_popup" className="hidden justify-center items-center w-full h-[100vh] fixed top-0 left-0 z-50 backdrop-blur-sm">
            <form className="flex flex-col gap-3 bg-[--respect-purple] max-w-72 w-full p-5 m-5 rounded-lg" style={{boxShadow: 'inset 0px 0px 8px 2px var(--respect-purple-dark)'}}>
                <input className="bg-[--respect-purple-deep] outline-none rounded-lg px-3 py-1" placeholder="Предмет" type="text" required />
                <input className="bg-[--respect-purple-deep] outline-none rounded-lg px-3 py-1" placeholder="Время" type="time" required />
                <input className="bg-[--respect-purple-deep] outline-none rounded-lg px-3 py-1" placeholder="Пара" type="number" required />
                <input className="bg-[--respect-purple-deep] outline-none rounded-lg px-3 py-1" placeholder="Кол-во респекта" type="number" required />

                <button className="bg-[--respect-purple-dark] p-3 rounded-lg mt-2" type="submit">Добавить</button>
                <button className="bg-[--respect-purple-dark] p-3 rounded-lg" type="button" onClick={e => {
                    e.currentTarget.parentElement!.parentElement!.classList.replace('flex', 'hidden');
                }}>Отмена</button>
            </form>
        </div>
        
    )
}

export default AddPopup;