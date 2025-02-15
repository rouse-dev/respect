import { StudentData } from "../store/AppContext";
import { toast } from "react-toastify";
import client from "./client";

interface UserData {
  avatar: any;
  email: string;
  password: string;
  name: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

interface ChangeRespectData {
  studentId: number;
  date?: string;
  class?:number;
  change: number;
  reason: string;
  lessonId: number;
  isPunish?: boolean;
  newLesson?: string;
}

export const LoginTeach = async (for_user: LoginUserData) => {
  try {
    const response = await client.post("/api/teachers/login", {
      email: for_user.email,
      password: for_user.password,
    });
    toast.success("Добро пожаловать");
    return { success: true, data: response.data };
  } catch (error) {
    toast.error("Неправльные данные")
    return {
      
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const LogoutTeach = async () => {
  try {
    const response = await client.post("/api/teachers/logout");
    return response.data.message;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка"
    }
  }
}

export const ChangeAvatar = async (for_user: UserData) => {
  try {
    const response = await client.patch("/api/teachers/avatar", {
      avatar: for_user.avatar,
    });
    console.log(response.data);
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const GetAllStudents = async () => {
  try {
    const response = await client.get("/api/students");
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};
export const CreateGroup = async (groupName: string) => {
  try {
    const response = await client.post("/api/groups", { name: groupName });

    console.log(response);
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const GetAllGroups = async () => {
  try {
    const response = await client.get("/api/groups");
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const ChangeRespect = async (newRep: ChangeRespectData) => {
  try {
    const response = await client.patch(
      `/api/students/${newRep.studentId}/reputation`,
      newRep
    );
    return { succes: true, data: response };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const HistoryStudent = async (studentId: number) => {
  try {
    const response = await client.get(`/api/students/${studentId}/history`);
    console.log(response);
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};
export const AddStudent = async (exported_students: StudentData[]) => {
  try {
    const response = await client.post("/api/students/many", {
      students: exported_students,
    });

    console.log(response.data);
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const getLessons = async () => {
  try {
    const response = await client.get(`/api/lessons`);
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
};

export const addLesson = async (name: string) => {
  try {
    const response = await client.post(`/api/lessons`, {
      name,
    });
    console.log("Предмет успешно создан!");
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
};

export const exportHistoryExcel = async (studentId: number) => {
  try {
    const response = await client.get(`/api/students/${studentId}/history/excel`, { responseType: 'blob' })
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}