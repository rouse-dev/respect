import  { createContext, useContext, useState, ReactNode } from "react";

interface Student {
  id: number;
  name: string;
  group: string;
  groupsId: number;
  respect: number;
}

interface Group {
  id: number;
  name: string;
  students: Student[];
}

interface AppContextType {
  user: {
    username: string;
    avatar: string;
  };
  setUser: (user: { username: string; avatar: string }) => void;
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
  sortMethods: string[];
  currentStudent: Student | null;
  setCurrentStudent: (student: Student | null) => void;
  students: Student[];
  setStudents: (students: Student[]) => void;
  sortedStudents: Student[];
  setSortedStudents: (students: Student[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState({
    username: "",
    avatar: "",
  });

  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState("");
  const [sortDirection, setSortDirection] = useState(true);
  const [currentSortMethod, setCurrentSortMethod] = useState("По фамилии");
  const [sortMethods] = useState(["По фамилии", "По группе", "По рейтингу"]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [sortedStudents, setSortedStudents] = useState<Student[]>([]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
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
        sortMethods,
        currentStudent,
        setCurrentStudent,
        students,
        setStudents,
        sortedStudents,
        setSortedStudents,
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