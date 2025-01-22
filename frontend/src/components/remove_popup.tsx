const RemovePopup = () => {
    return (
        <div id="respect_remove_popup" className="hidden justify-center items-center w-full h-[100vh] fixed top-0 left-0 z-50 backdrop-blur-sm">
            <form className="flex flex-col gap-3 bg-[--respect-purple] max-w-72 w-full p-5 m-5 rounded-lg" style={{boxShadow: 'inset 0px 0px 8px 2px var(--respect-purple-dark)'}}>
                <div className="cursor-pointer flex flex-row items-center gap-3 bg-[--respect-purple-deep] rounded-lg px-3 py-1" onClick={e => {
                    const button :HTMLElement = e.currentTarget;
                    const input :HTMLElement = button.querySelector('input[type=radio]') as HTMLElement;
                    
                    input.click();
                }}>
                    <input className="hidden peer" type="radio" name="respect_remove_radio" id="pass_radio" required/>
                    <div className="min-w-4 h-4 rounded-[100%] peer-checked:bg-white bg-[--respect-purple-dark]"></div>
                    <p>Пропуск</p>
                </div>
                <div className="cursor-pointer flex flex-row items-center gap-3 bg-[--respect-purple-deep] rounded-lg px-3 py-1" onClick={e => {
                    const button :HTMLElement = e.currentTarget;
                    const input :HTMLElement = button.querySelector('input[type=radio]') as HTMLElement;

                    input.click();
                }}>
                    <input className="hidden peer" type="radio" name="respect_remove_radio" id="skip_radio" required/>
                    <div className="min-w-4 h-4 rounded-[100%] peer-checked:bg-white bg-[--respect-purple-dark]"></div>
                    <p>Прогул</p>
                </div>
                <div className="cursor-pointer flex flex-row items-center gap-3 bg-[--respect-purple-deep] rounded-lg px-3 py-1" onClick={e => {
                    const button :HTMLElement = e.currentTarget;
                    const input :HTMLElement = button.querySelector('input[type=radio]') as HTMLElement;
                    
                    input.click();
                }}>
                    <input className="hidden peer" type="radio" name="respect_remove_radio" id="debt_radio" required/>
                    <div className="min-w-4 h-4 rounded-[100%] peer-checked:bg-white bg-[--respect-purple-dark]"></div>
                    <p>Снятие долга</p>
                    <input className="hidden peer-checked:block max-w-9 ml-auto -mr-2 pl-3 outline-none bg-[--respect-purple-dark] rounded-lg" defaultValue={1} type="text" id="debt_count" />
                </div>

                <button className="bg-[--respect-purple-dark] p-3 rounded-lg mt-2" type="submit">Списать</button>
                <button className="bg-[--respect-purple-dark] p-3 rounded-lg" type="button" onClick={e => {
                    e.currentTarget.parentElement!.parentElement!.classList.replace('flex', 'hidden');
                }}>Отмена</button>
            </form>
        </div>
        
    )
}

export default RemovePopup;