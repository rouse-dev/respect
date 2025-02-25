import  { createContext, useContext, useState, ReactNode } from "react";

export interface Student {
  id: number;
  name: string;
  groups: Group;
  groupsId: number;
  reputation: number;
}

export interface Group {
  id: number;
  name: string;
  students: Student[];
}
export interface LessonInterface{
  id: number;
  name: string;
}

export interface Subject {
  id: number,
  name: string
}

export interface StudentData {
  id?: number;
  name: string;
  groupsId: number;
}

export interface ExcelReaderProps {
  setData: (data: StudentData[]) => void;
}

interface AppContextType {
  currentGroup: Group | null;
  setCurrentGroup: (group: Group | null) => void;
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  search: string;
  setSearch: (search: string) => void;
  sortDirection: boolean;
  setSortDirection: (direction: boolean) => void;
  currentSortMethod: string;
  setCurrentSortMethod: (method: string) => void;
  sortTop: number,
  setSortTop: (arg: number) => void,
  currentStudent: Student | null;
  setCurrentStudent: (student: Student | null) => void;
  students: Student[];
  setStudents: (students: Student[]) => void;
  sortedStudents: Student[];
  setSortedStudents: (students: Student[]) => void;
  popupActive: boolean,
  setPopupActive: (status: boolean) => void;
  exportGroup: Group | null,
  setExportGroup: (group: Group | null) => void;
  selectedGroup: Group | null,
  setSelectedGroup: (data: Group | null) => void;
  lessons: LessonInterface[] | [],
  setLessons: (lesson: LessonInterface[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState("");
  const [lessons,setLessons] = useState<LessonInterface[]>([])
  const [sortDirection, setSortDirection] = useState(true);
  const [currentSortMethod, setCurrentSortMethod] = useState("По фамилии");
  const [sortTop, setSortTop] = useState(0);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [sortedStudents, setSortedStudents] = useState<Student[]>([]);
  const [popupActive, setPopupActive] = useState(false);
  const [exportGroup, setExportGroup] = useState<Group | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  return (
    <AppContext.Provider
      value={{
        lessons,
        setLessons,
        currentGroup,
        setCurrentGroup,
        groups,
        setGroups,
        search,
        setSearch,
        sortDirection,
        setSortDirection,
        currentSortMethod,
        setCurrentSortMethod,
        sortTop,
        setSortTop,
        currentStudent,
        setCurrentStudent,
        students,
        setStudents,
        sortedStudents,
        setSortedStudents,
        popupActive,
        setPopupActive,
        exportGroup,
        setExportGroup,
        selectedGroup,
        setSelectedGroup
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};