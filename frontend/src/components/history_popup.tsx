const HistoryPopup = (params :any) => {
    return (
        <div id="respect_history_popup" className="hidden justify-center items-center w-full h-[100vh] fixed top-0 left-0 z-50 backdrop-blur-sm">
            <form className="flex flex-col gap-3 bg-[--respect-purple] max-w-96 w-full p-5 m-5 rounded-lg" style={{boxShadow: 'inset 0px 0px 8px 2px var(--respect-purple-dark)'}}>

                <p className="text-center rounded-lg px-3 py-1">Студент:</p>
                <p className="bg-[--respect-purple-deep] rounded-lg px-3 py-1">{params.student.name}</p>
                <p className="bg-[--respect-purple-deep] rounded-lg px-3 py-1">{params.student.group}</p>
                <p className="bg-[--respect-purple-deep] rounded-lg px-3 py-1">Респект: {params.student.respect}</p>

                <p className="text-center rounded-lg px-3 py-1">История респекта:</p>
                <div className="flex flex-col gap-3 bg-[--respect-purple-deep] rounded-lg p-3 max-h-56 overflow-y-scroll overflow-x-hidden">

                    <div className="flex flex-row gap-2 sm:gap-3 flex-wrap px-3 py-1 rounded-lg border border-red-500">
                        <p className="text-red-500">- 42</p>
                        <p>причина бана</p>
                        <p className="self-end text-xs text-[--respect-purple-dark] ml-auto">дата-время</p>
                    </div>
                    <div className="flex flex-row gap-2 sm:gap-3 flex-wrap px-3 py-1 rounded-lg border border-green-500">
                        <p className="text-green-500">+ 42</p>
                        <p>причина бана</p>
                        <p className="self-end text-xs text-[--respect-purple-dark] ml-auto">дата-время</p>
                    </div>
                    <div className="flex flex-row gap-2 sm:gap-3 flex-wrap px-3 py-1 rounded-lg border border-red-500">
                        <p className="text-red-500">- 42</p>
                        <p>причина бана</p>
                        <p className="self-end text-xs text-[--respect-purple-dark] ml-auto">дата-время</p>
                    </div>
                    <div className="flex flex-row gap-2 sm:gap-3 flex-wrap px-3 py-1 rounded-lg border border-red-500">
                        <p className="text-red-500">- 42</p>
                        <p>причина бана</p>
                        <p className="self-end text-xs text-[--respect-purple-dark] ml-auto">дата-время</p>
                    </div>
                    <div className="flex flex-row gap-2 sm:gap-3 flex-wrap px-3 py-1 rounded-lg border border-green-500">
                        <p className="text-green-500">+ 42</p>
                        <p>причина бана</p>
                        <p className="self-end text-xs text-[--respect-purple-dark] ml-auto">дата-время</p>
                    </div>
                    <div className="flex flex-row gap-2 sm:gap-3 flex-wrap px-3 py-1 rounded-lg border border-red-500">
                        <p className="text-red-500">- 42</p>
                        <p>причина бана</p>
                        <p className="self-end text-xs text-[--respect-purple-dark] ml-auto">дата-время</p>
                    </div>
                    <div className="flex flex-row gap-2 sm:gap-3 flex-wrap px-3 py-1 rounded-lg border border-green-500">
                        <p className="text-green-500">+ 42</p>
                        <p>причина бана</p>
                        <p className="self-end text-xs text-[--respect-purple-dark] ml-auto">дата-время</p>
                    </div>
                    <div className="flex flex-row gap-2 sm:gap-3 flex-wrap px-3 py-1 rounded-lg border border-green-500">
                        <p className="text-green-500">+ 42</p>
                        <p>причина бана</p>
                        <p className="self-end text-xs text-[--respect-purple-dark] ml-auto">дата-время</p>
                    </div>

                </div>

                <button className="bg-[--respect-purple-dark] p-3 rounded-lg" type="button" onClick={_ => {
                    params.setCurrentStudent({});
                }}>Закрыть</button>
            </form>
        </div>
    )
}

export default HistoryPopup;