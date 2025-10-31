

export const DebtHistoryContainer = ()=>{
    return(
        <>
          <div className="w-[60%] h-[540px] bg-[--respect-purple-deep] rounded-lg p-2 px-4 overflow-y-auto">
            <h2 className="text-xl mb-2">История заявок</h2>
            <button className="p-2 px-3 bg-[#7fad75] rounded-lg mb-3">Сортировка</button>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-2 border-red-500 gap-2 p-3 mr-3 w-full rounded-lg bg-[--respect-purple-dark] hover:opacity-90">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm opacity-70">02.10.2024</p>
                        <p>Причина</p>
                    </div>
                    <p className="font-bold text-red-400">-100</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-2 border-red-500 gap-2 p-3 mr-3 w-full rounded-lg bg-[--respect-purple-dark] hover:opacity-90">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm opacity-70">02.10.2024</p>
                        <p>Причина</p>
                    </div>
                    <p className="font-bold text-red-400">-100</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-2 border-red-500 gap-2 p-3 mr-3 w-full rounded-lg bg-[--respect-purple-dark] hover:opacity-90">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm opacity-70">02.10.2024</p>
                        <p>Причина</p>
                    </div>
                    <p className="font-bold text-red-400">-100</p>
                </div>
            </div>
          </div>
            
        </>
        
    )
}