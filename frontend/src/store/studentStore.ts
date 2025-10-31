import { create } from "zustand";
import { Student } from "../interfaces/student";

interface IStudentStore {
    currentStudent: Student | null;
    setCurrentStudent: (_: Student | null) => void;
    students: Student[];
    setStudents: (_: Student[]) => void;
    sortedStudents: Student[];
    setSortedStudents: (_: Student[]) => void;
}

const useStudentStore = create<IStudentStore>((set) => ({
    currentStudent: null,
    setCurrentStudent: (state: Student | null) => set(() => ({currentStudent: state})),
    students: [],
    setStudents: (state: Student[]) => set(() => ({students: state})),
    sortedStudents: [],
    setSortedStudents: (state: Student[]) => {
        console.log('setSortedStudents')
        set(() => ({sortedStudents: state}))
    },
}));

export default useStudentStore;