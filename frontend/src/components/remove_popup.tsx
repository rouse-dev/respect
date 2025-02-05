import { useState } from "react";
import { ChangeRespect } from "../service/server";
import Preloader from "./preloader";

interface RemovePopupProps {
    studentId: string;
    onClose: () => void;
    isOpen: boolean;
}

const RemovePopup = ({ studentId, onClose, isOpen }: RemovePopupProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState(1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const selectedOption = form.querySelector('input[name="respect_remove_radio"]:checked') as HTMLInputElement;

        if (!selectedOption) {
            alert('Пожалуйста, выберите причину списания');
            return;
        }

        let deduction = 0;
        let reason = '';

        switch (selectedOption.id) {
            case 'propusk':
                deduction = -100;
                reason = 'Пропуск';
                break;
            case 'skip_para':
                deduction = -150;
                reason = 'Прогул';
                break;
            case 'dolg':
                deduction = -50 * amount;
                reason = `Снятие долга (${amount} шт.)`;
                break;
        }

        setIsLoading(true);
        try {
            const result = await ChangeRespect({ studentId, change: deduction, reason });
            if (result.succes) {
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
            <div id="respect_remove_popup" className="flex justify-center items-center w-full h-[100vh] fixed top-0 left-0 z-50 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-[--respect-purple] max-w-72 w-full p-5 m-5 rounded-lg" style={{boxShadow: 'inset 0px 0px 8px 2px var(--respect-purple-dark)'}}>
                    <div className="cursor-pointer flex flex-row items-center gap-3 bg-[--respect-purple-deep] rounded-lg px-3 py-1" onClick={e => {
                        const button = e.currentTarget;
                        const input = button.querySelector('input[type=radio]') as HTMLElement;
                        input.click();
                    }}>
                        <input className="hidden peer" type="radio" name="respect_remove_radio" id="propusk" required/>
                        <div className="min-w-4 h-4 rounded-[100%] peer-checked:bg-white bg-[--respect-purple-dark]"></div>
                        <p>Пропуск (-100)</p>
                    </div>
                    <div className="cursor-pointer flex flex-row items-center gap-3 bg-[--respect-purple-deep] rounded-lg px-3 py-1" onClick={e => {
                        const button = e.currentTarget;
                        const input = button.querySelector('input[type=radio]') as HTMLElement;
                        input.click();
                    }}>
                        <input className="hidden peer" type="radio" name="respect_remove_radio" id="skip_para" required/>
                        <div className="min-w-4 h-4 rounded-[100%] peer-checked:bg-white bg-[--respect-purple-dark]"></div>
                        <p>Прогул (-150)</p>
                    </div>
                    <div className="cursor-pointer flex flex-row items-center gap-3 bg-[--respect-purple-deep] rounded-lg px-3 py-1" onClick={e => {
                        const button = e.currentTarget;
                        const input = button.querySelector('input[type=radio]') as HTMLElement;
                        input.click();
                    }}>
                        <input className="hidden peer" type="radio" name="respect_remove_radio" id="dolg" required/>
                        <div className="min-w-4 h-4 rounded-[100%] peer-checked:bg-white bg-[--respect-purple-dark]"></div>
                        <p>Снятие долга (-50)</p>
                        <input 
                            className="block ml-auto -mr-2 pl-3 w-16 outline-none bg-[--respect-purple-dark] rounded-lg" 
                            type="number"
                            min="1"
                            value={amount}
                            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                    </div>

                    <button className="bg-[--respect-purple-dark] p-3 rounded-lg mt-2" type="submit">Списать</button>
                    <button className="bg-[--respect-purple-dark] p-3 rounded-lg" type="button" onClick={onClose}>
                        Отмена
                    </button>
                </form>
            </div>
        </>
    );
};

export default RemovePopup;