import { useState } from "react";
import placeholder_avatar from '../assets/media/placeholder_avatar.png';
import RemovePopup from "../components/remove_popup";
import AddPopup from "../components/add_popup";
import { Link } from "react-router-dom";

const Home = () => {
    const [user, setUser] = useState({
        username: '',
        avatar: ''
    });
    const [currentGroup, setCurrentGroup] = useState('');
    const [currentSort, setCurrentSort] = useState({
        method: 'По фамилии',
        direction_up: true
    });
    const sort_methods :Array<String> = [
        'По фамилии',
        'По группе',
        'По рейтингу'
    ];
    const group_names :Array<String> = [
        'ИС-223',
        'ИС-223',
        'ИС-223',
        'ИС-223',
        'ИС-223',
        'ИС-223',
        'ИС-222б',
        'ИС-221б'
    ]

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-5 text-lg p-3 sm:p-5 text-white">

            <AddPopup />
            <RemovePopup />

            <div className="flex flex-col sm:flex-row gap-5 justify-between mb-6 sm:mb-12">
                <div className="relative cursor-pointer selection:bg-transparent flex flex-row order-2 sm:order-1 justify-end items-center px-5 py-2 rounded-t-lg rounded-b-lg gap-5 bg-[--respect-purple-deep]" onClick={e => {
                    const dropdown = e.currentTarget;
                    dropdown.classList.toggle('rounded-b-lg');

                    dropdown.querySelector('div')!.classList.contains('hidden')?
                    dropdown.querySelector('div')!.classList.replace('hidden', 'flex'):
                    dropdown.querySelector('div')!.classList.replace('flex', 'hidden');

                    dropdown.querySelector('i')!.classList.contains('fa-angle-down')?
                    dropdown.querySelector('i')!.classList.replace('fa-angle-down', 'fa-angle-up'):
                    dropdown.querySelector('i')!.classList.replace('fa-angle-up', 'fa-angle-down');
                }}>
                    <p className="flex mr-auto">{currentGroup || '- группа -'}</p>
                    <p className="hidden sm:block">|</p>
                    <i className="fa fa-angle-up" aria-hidden="true"></i>

                    <div className="hidden z-20 flex-col absolute left-0 top-full w-full max-h-64 overflow-y-scroll overflow-x-hidden rounded-b-lg border-[6px] border-t-0 border-[--respect-purple-deep] bg-[--respect-purple]">
                        {group_names.map((el, i) => 
                            <button className="py-2 hover:backdrop-brightness-110 last:rounded-b-sm" key={i}>{el}</button>
                        )}
                    </div>
                </div>
                <Link className="flex flex-row order-1 sm:order-2 justify-center items-center px-3 py-2 rounded-lg gap-4 bg-[--respect-purple-deep]" to='/profile'>
                    <p className="flex w-fit">{user.username || '- Фамилия И.О. -'}</p>
                    <img className="w-11 h-11 rounded-[100%]" src={user.avatar ? `http://localhost:0000/some_folder/${user.avatar}` : placeholder_avatar} />
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 justify-between">
                <div className="flex flex-row gap-2 sm:max-w-lg w-full">
                    <div className="relative selection:bg-transparent w-full cursor-pointer flex flex-row justify-end items-center px-3 sm:px-5 py-2 rounded-t-lg rounded-b-lg gap-2 sm:gap-5 bg-[--respect-purple-deep]" onClick={e => {
                        const dropdown = e.currentTarget;
                        dropdown.classList.toggle('rounded-b-lg');

                        dropdown.querySelector('div')!.classList.contains('hidden')?
                        dropdown.querySelector('div')!.classList.replace('hidden', 'flex'):
                        dropdown.querySelector('div')!.classList.replace('flex', 'hidden');
    
                        dropdown.querySelector('i')!.classList.contains('fa-angle-down')?
                        dropdown.querySelector('i')!.classList.replace('fa-angle-down', 'fa-angle-up'):
                        dropdown.querySelector('i')!.classList.replace('fa-angle-up', 'fa-angle-down');
                    }}>
                        <p className="flex mr-auto">{currentSort.method}</p>
                        <p className="hidden sm:block">|</p>
                        <i className="fa fa-angle-up" aria-hidden="true"></i>

                        <div className="hidden z-10 flex-col absolute left-0 top-full w-full rounded-b-lg border-[6px] border-t-0 border-[--respect-purple-deep] bg-[--respect-purple]">
                            {sort_methods.map((el, i) =>
                                <button className="px-3 py-2 hover:backdrop-brightness-110 last:rounded-b-sm text-left" key={i}>{el}</button>
                            )}
                        </div>
                    </div>
                    <button className="px-5 py-2 rounded-lg gap-5 bg-[--respect-purple-deep]" onClick={_=>setCurrentSort(prev=>({...prev, direction_up: !currentSort.direction_up}))}>
                        {currentSort.direction_up ? <i className="fa fa-long-arrow-up" aria-hidden="true"></i> : <i className="fa fa-long-arrow-down" aria-hidden="true"></i>}
                    </button>
                </div>
                <input className="sm:max-w-xs w-full bg-[--respect-purple-deep] rounded-lg py-2 pl-3 outline-none" placeholder="Поиск по фамилии..." type="text" />
            </div>

            <div className="flex flex-col gap-5 bg-[--respect-purple-deep] p-5 rounded-lg">
                <div className="hidden sm:flex flex-row gap-5">
                    <p className="rounded-lg px-3 py-2 bg-[--respect-purple-dark] w-2/6">ФИО</p>
                    <p className="rounded-lg px-3 py-2 bg-[--respect-purple-dark] w-1/6">Группа</p>
                    <p className="rounded-lg px-3 py-2 bg-[--respect-purple-dark] w-3/6">Респект</p>
                </div>
                <div className="flex sm:hidden flex-row gap-5">
                    <p className="rounded-lg px-2 py-1 bg-[--respect-purple-dark] w-2/3">ФИО / Группа</p>
                    <p className="rounded-lg text-center px-2 py-1 bg-[--respect-purple-dark] w-1/3 overflow-hidden overflow-ellipsis">Респект</p>
                </div>
                
                <div className="flex flex-col gap-3">

                    <div className="flex flex-row bg-[--respect-purple] rounded-lg py-1">
                        <div className="flex flex-col sm:flex-row justify-between sm:gap-5 w-2/3 sm:w-1/2">
                            <p className="px-3 py-2 w-2/3 text-xl sm:text-lg">Беги Беги Оп</p>
                            <p className="px-3 py-2 sm:w-1/3 text-base sm:text-lg whitespace-nowrap">ИС-1488</p>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 px-3 py-2 w-1/3 sm:w-1/2">
                            <p className="sm:w-1/3 text-xl whitespace-nowrap sm:text-lg sm:ml-5 hidden sm:block">999</p>
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-2/3">
                                <button className="w-full rounded-lg bg-red-400 transition-transform hover:bg-red-600 active:scale-95 hover:scale-105 order-3 sm:order-1" onClick={_ => {
                                    document.getElementById('respect_remove_popup')!.classList.replace('hidden', 'flex');
                                }}><i className="fa fa-minus" aria-hidden="true"></i></button>
                                <p className="sm:w-1/3 text-xl whitespace-nowrap sm:text-lg sm:ml-5 sm:hidden order-2">999</p>
                                <button className="w-full rounded-lg bg-[#7fad75] transition-transform hover:bg-[#4cb834] active:scale-95 hover:scale-105 order-1 sm:order-3" onClick={_ => {
                                    document.getElementById('respect_add_popup')!.classList.replace('hidden', 'flex');
                                }}><i className="fa fa-plus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row bg-[--respect-purple] rounded-lg py-1">
                        <div className="flex flex-col sm:flex-row justify-between sm:gap-5 w-2/3 sm:w-1/2">
                            <p className="px-3 py-2 w-2/3 text-xl sm:text-lg">Беги Беги Оп</p>
                            <p className="px-3 py-2 sm:w-1/3 text-base sm:text-lg whitespace-nowrap">ИС-1488</p>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 px-3 py-2 w-1/3 sm:w-1/2">
                            <p className="sm:w-1/3 text-xl whitespace-nowrap sm:text-lg sm:ml-5 hidden sm:block">999</p>
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-2/3">
                                <button className="w-full rounded-lg bg-red-400 transition-transform hover:bg-red-600 active:scale-95 hover:scale-105 order-3 sm:order-1"><i className="fa fa-minus" aria-hidden="true"></i></button>
                                <p className="sm:w-1/3 text-xl whitespace-nowrap sm:text-lg sm:ml-5 sm:hidden order-2">999</p>
                                <button className="w-full rounded-lg bg-[#7fad75] transition-transform hover:bg-[#4cb834] active:scale-95 hover:scale-105 order-1 sm:order-3"><i className="fa fa-plus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row bg-[--respect-purple] rounded-lg py-1">
                        <div className="flex flex-col sm:flex-row justify-between sm:gap-5 w-2/3 sm:w-1/2">
                            <p className="px-3 py-2 w-2/3 text-xl sm:text-lg">Беги Беги Оп</p>
                            <p className="px-3 py-2 sm:w-1/3 text-base sm:text-lg whitespace-nowrap">ИС-1488</p>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 px-3 py-2 w-1/3 sm:w-1/2">
                            <p className="sm:w-1/3 text-xl whitespace-nowrap sm:text-lg sm:ml-5 hidden sm:block">999</p>
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-2/3">
                                <button className="w-full rounded-lg bg-red-400 transition-transform hover:bg-red-600 active:scale-95 hover:scale-105 order-3 sm:order-1"><i className="fa fa-minus" aria-hidden="true"></i></button>
                                <p className="sm:w-1/3 text-xl whitespace-nowrap sm:text-lg sm:ml-5 sm:hidden order-2">999</p>
                                <button className="w-full rounded-lg bg-[#7fad75] transition-transform hover:bg-[#4cb834] active:scale-95 hover:scale-105 order-1 sm:order-3"><i className="fa fa-plus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Home;