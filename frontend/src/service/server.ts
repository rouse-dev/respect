import axios, { AxiosResponse } from "axios";
import { StudentData } from "../store/AppContext";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

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
  change: number;
  reason: string;
  lessonId: number;
  isPunish?: boolean;
}

const getToken = () => {
  const userData = localStorage.getItem("userData");
  if (!userData) {
    throw new Error("Токен отсутствует в localStorage");
  }
  return userData;
};

export const LoginTeach = async (for_user: LoginUserData) => {
  try {
    const response = await axios.post(API + "/api/teachers/login", {
      email: for_user.email,
      password: for_user.password,
    });
    toast.info("Добро пожаловать");
    return { success: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const ChangeAvatar = async (for_user: UserData) => {
  try {
    const response = await axios.patch(API + "/api/teachers/avatar", {
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
    const token = getToken();
    const response = await axios.get(API + "/api/students", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};
export const CreateGroup = async (groupName: string) => {
  try {
    const token = getToken();
    const response = await axios.post(
      API + "/api/groups",
      { name: groupName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
    const token = getToken();
    const response = await axios.get(API + "/api/groups", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const ChangeRespect = async (newRep: ChangeRespectData) => {
  try {
    const token = getToken();
    const response = await axios.patch(
      API + `/api/students/${newRep.studentId}/reputation`,
      newRep,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
    const token = getToken();
    const response = await axios.get(
      API + `/api/students/${studentId}/history`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
    const token = getToken();
    const response = await axios.post(
      API + "/api/students/many",
      { students: exported_students },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
    const token = getToken();
    const response = await axios.get(API + `/api/lessons`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
};

export const addLesson = async (name: string) => {
  try {
    const token = getToken();
    const response = await axios.post(
      API + `/api/lessons`,
      {
        name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Предмет успешно создан!");
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
};

export const exportDataWithExcel = async (studentId: number, name: string): Promise<Blob | null> => {
  try {
    const token = getToken();
    const response: AxiosResponse<Blob> = await axios.get(
      `http://localhost:3000/api/students/${studentId}/history/excel`,
      {
        params: { name },
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Ошибка при экспорте данных:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Произошла ошибка при экспорте данных.");
    }
  }
};