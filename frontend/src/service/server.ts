import { StudentData } from "../store/AppContext";
import { toast } from "react-toastify";
import client from "./client";

interface LoginUserData {
  email: string;
  password: string;
}

interface TeacherChangeData {
  name?: string
  email?: string,
  password?: string,
}

interface UpdateGroup{
  id:number;
  name:string;
}

interface UpdateStudent{
  id:number;
  name:string;
}
interface UpdateLesson{
  id:number;
  name:string;
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

export const ChangeTeacherInfo = async (for_user: TeacherChangeData) => {
  try {
    const response = await client.patch("/api/teachers/change", for_user);
    toast.success('Данные преподавателя изменены');
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const ChangeTeacherAvatar = async (for_user: FormData) => {
  try {
    const response = await client.patch("/api/teachers/avatar", for_user);
    toast.success('Аватар преподавателя изменён');
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
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};
export const AddStudent = async (exported_students: StudentData[]) => {
  console.log(exported_students)
  try {
    const response = await client.post("/api/students/many", {
      students: exported_students,
    });
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
    toast.success('Предмет добавлен')
    return response.data;
  } catch (error) {
    toast.error('Ошибка')
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
export const deleteLesson = async (lessonId: number) => {
  try {
    const response = await client.delete(`/api/lessons/${lessonId}`)
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}
export const deleteStudent = async (studentId: number) => {
  try {
    const response = await client.delete(`/api/students/${studentId}`)
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}
export const deleteGroup = async (groupId: number) => {
  try {
    const response = await client.delete(`/api/groups/${groupId}`)
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}


export const updateLesson = async (lesson: UpdateLesson) => {
  try {
    const response = await client.patch(`/api/lessons/${lesson.id}`,lesson)
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}

export const updateStudent = async (student: UpdateStudent) => {
  try {
    const response = await client.patch(`/api/students/${student.id}`,student)
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}
export const updateGroup = async (group: UpdateGroup) => {
  try {
    const response = await client.patch(`/api/groups/${group.id}`, group)
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}