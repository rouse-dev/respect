

export const DebtView = ()=>{
    return(
        <div className="w-full h-[525px] bg-[--respect-purple-deep] rounded-2xl flex p-3 px-6">
            <div className="w-[50%]">
                <p className="text-3xl mb-2">Заявки</p>

                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
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
            <div className="w-[50%] px-8 ">
                <form className="h-[60%]">
                    <label className="text-3xl">Оставить комментарий</label>
                    <textarea name="" id="" className="mt-2 bg-[--respect-purple-deep] outline-none border-2 border-[--respect-purple-dark] w-full h-[100%] rounded-xl p-2 resize-none"></textarea>
                    <div className="flex flex-col gap-3">
                        <button className="p-4 px-5 bg-[#7fad75] rounded-2xl text-center">Принять</button>
                        <button className="p-4 px-7 bg-red-400 rounded-2xl text-center">Отклонить</button>
                    </div>
                   
                </form>
                
                <div></div>
            </div>
        </div>
    )
}