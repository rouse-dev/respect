import { create } from "zustand";

interface IFilterStore {
    search: string;
    setSearch: (_: string) => void;
    sortDirection: boolean;
    setSortDirection: (_: boolean) => void;
    currentSortMethod: string;
    setCurrentSortMethod: (_: string) => void;
    sortTop: number,
    setSortTop: (_: number) => void,
}

const useFilterStore = create<IFilterStore>((set) => ({
    search: '',
    setSearch: (state: string) => {set(() => ({search: state}))},
    sortDirection: true,
    setSortDirection: (state: boolean) => {set(() => ({sortDirection: state}))},
    currentSortMethod: "По фамилии",
    setCurrentSortMethod: (state: string) => {set(() => ({currentSortMethod: state}))},
    sortTop: 0,
    setSortTop: (state: number) => {set(() => ({sortTop: state}))},
}));

export default useFilterStore;