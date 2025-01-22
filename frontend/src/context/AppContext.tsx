import {createContext, useContext, useState, useEffect, ReactNode} from "react";

interface studentInterface {
  name: string;
  group: string;
  respect: number;
}

interface AppContextType {
  user: {
    username: string;
    avatar: string;
  };
  setUser: (user: { username: string; avatar: string }) => void;
  currentGroup: string;
  setCurrentGroup: (group: string) => void;
  groups: string[];
  search: string;
  setSearch: (search: string) => void;
  sortDirection: boolean;
  setSortDirection: (direction: boolean) => void;
  currentSortMethod: string;
  setCurrentSortMethod: (method: string) => void;
  sortMethods: string[];
  currentStudent: any;
  setCurrentStudent: (student: any) => void;
  students: studentInterface[];
  setStudents: (students: studentInterface[]) => void;
  sortedStudents: studentInterface[];
  setSortedStudents: (students: studentInterface[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState({
    username: "",
    avatar: "",
  });

  const [currentGroup, setCurrentGroup] = useState("- группа -");
  const [groups] = useState(["Все группы", "ИС-223", "ИС-222б", "ИС-221б"]);

  const [search, setSearch] = useState("");
  const [sortDirection, setSortDirection] = useState(true);
  const [currentSortMethod, setCurrentSortMethod] = useState("");
  const [sortMethods] = useState(["По фамилии", "По группе", "По рейтингу"]);

  const [currentStudent, setCurrentStudent] = useState({});
  const [students, setStudents] = useState<studentInterface[]>([
    {
      name: "Абунагимов Айзат",
      group: "ИС-223",
      respect: 999,
    },
    {
      name: "Касимов Ислам",
      group: "ИС-223",
      respect: 1,
    },
    {
      name: "Закиров Раиф",
      group: "ИС-221б",
      respect: 228,
    },
  ]);

  const [sortedStudents, setSortedStudents] = useState<studentInterface[]>([]);

  useEffect(() => {
    setCurrentSortMethod("По фамилии");
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        currentGroup,
        setCurrentGroup,
        groups,
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
