import { create } from "zustand";

interface IPopupStore {
    popupActive: boolean;
    setPopupActive: (_: boolean) => void;
    popupElementRef: React.RefObject<HTMLDivElement> | null;
}

const usePopupStore = create<IPopupStore>((set) => ({
    popupActive: false,
    setPopupActive: (state: boolean) => set(() => ({popupActive: state})),
    popupElementRef: null,
}));

export default usePopupStore;