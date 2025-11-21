import { FC, useEffect, useState } from "react"
import { getHistory } from "../../../service/student"
import { toast } from "react-toastify"
import Preloader from "../../common/preloader/preloader"
import HistoryItem from "../../../interfaces/history_item"
import Filter from "../../common/utils/ReputationFilter"
import Paginator from "../../common/popups/historyPopup/Paginator"
import { UserStoreInterface } from "../../../store/userStore"

interface HistoryInfoProps {
    useUserStore: UserStoreInterface
}

export const HistoryInfo: FC<HistoryInfoProps> = ({ useUserStore }) => {
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([])
    const [paginatedHistory, setPaginatedHistory] = useState<HistoryItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    
    const [sortRespect, setSortRespect] = useState('Все')
    const [selectedDate1, setSelectedDate1] = useState('')
    const [selectedDate2, setSelectedDate2] = useState('')

    const itemsPerPage = 5

    useEffect(() => {
        fetchHistory()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [history, sortRespect, selectedDate1, selectedDate2])

    useEffect(() => {
        updatePagination()
    }, [filteredHistory, currentPage])

    const fetchHistory = async () => {
        setIsLoading(true)
        try {
            const response = await getHistory()
            if (response && !response.error) {
                const reversedHistory = [...response].reverse()
                setHistory(reversedHistory)
            } else {
                toast.error(response?.error || 'Ошибка при загрузке истории')
            }
        } catch (error) {
            console.error('Ошибка при загрузке истории:', error)
            toast.error('Произошла ошибка при загрузке истории')
        } finally {
            setIsLoading(false)
        }
    }

    const applyFilters = () => {
        let filtered = [...history]

        if (sortRespect === 'Зачисления') {
            filtered = filtered.filter(item => item.change > 0)
        } else if (sortRespect === 'Списания') {
            filtered = filtered.filter(item => item.change < 0)
        }

        if (selectedDate1 || selectedDate2) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.createdAt).getTime()
                const date1Time = selectedDate1 ? new Date(selectedDate1).getTime() : 0
                const date2Time = selectedDate2 ? new Date(selectedDate2).getTime() : Date.now()

                if (selectedDate1 && selectedDate2) {
                    return itemDate >= date1Time && itemDate <= date2Time
                } else if (selectedDate1) {
                    return itemDate >= date1Time
                } else if (selectedDate2) {
                    return itemDate <= date2Time
                }
                return true
            })
        }

        setFilteredHistory(filtered)
        setTotalPages(Math.ceil(filtered.length / itemsPerPage))
        setCurrentPage(1)
    }

    const updatePagination = () => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        setPaginatedHistory(filteredHistory.slice(startIndex, endIndex))
    }

    const goToPage = (page: number) => {
        setCurrentPage(page)
    }

    const handleDateChange = (date1?: string, date2?: string) => {
        if (date1 !== undefined) setSelectedDate1(date1)
        if (date2 !== undefined) setSelectedDate2(date2)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU')
    }

    return (
        <>
            {isLoading && <Preloader />}
            <div className="w-full h-[670px] bg-[--respect-purple-deep] rounded-lg p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold mb-4">История изменений репутации</h2>
                    <div className="flex gap-4">
                        <p className="w-fit whitespace-nowrap px-4 h-10 bg-[--respect-purple-dark] flex items-center justify-center rounded-lg">
                            Группа: {useUserStore.groups?.name || 'Не указана'}
                        </p>
                        <p className="w-fit whitespace-nowrap px-4 h-10 bg-[--respect-purple-dark] flex items-center justify-center rounded-lg">
                            Репутация: {useUserStore.reputation || 0}
                        </p>
                    </div>
                </div>
                
                <Filter 
                    sortRespect={sortRespect} 
                    setSortRespect={setSortRespect}
                    selectedDate1={selectedDate1}
                    selectedDate2={selectedDate2}
                    setSelectedDates={handleDateChange}
                />

                <div className="flex-1 overflow-y-auto flex flex-col gap-3">
                    {paginatedHistory.length > 0 ? (
                        paginatedHistory.map((item, index) => (
                            <div
                                key={index}
                                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-2 gap-2 p-3 rounded-lg bg-[--respect-purple-dark] ${
                                    item.change > 0 ? "border-green-500" : "border-red-500"
                                }`}
                            >
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm opacity-70">{formatDate(item.createdAt)}</p>
                                    <p>{item.lesson} {item.class ? `| Пара: ${item.class}` : ''} | {item.reason}</p>
                                </div>
                                <p className={`font-bold ${
                                    item.change > 0 ? "text-[#7fad75]" : "text-red-400"
                                }`}>
                                    {item.change > 0 ? "+" : ""}{item.change}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-4">История изменений пуста</p>
                    )}
                </div>

                {totalPages > 1 && (
                    <Paginator
                        currentPage={currentPage}
                        totalPages={totalPages}
                        goToPage={goToPage}
                    />
                )}
            </div>
        </>
    )
}