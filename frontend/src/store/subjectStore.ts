import { create } from "zustand";
import { Subject } from "../interfaces/subject";

interface ISubjectStore {
    subjects: Subject[],
    setSubjects: (_: Subject[]) => void;
}

const useSubjectStore = create<ISubjectStore>((set) => ({
    subjects: [],
    setSubjects: (state: Subject[]) => set(() => ({subjects: state}))
}))

export default useSubjectStore;