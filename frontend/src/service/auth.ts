import { toast } from "react-toastify";
import client from "./client";

interface LoginUserData {
  email: string;
  password: string;
}
interface TeacherChangeData {
  name?: string | null
  email?: string | null,
  password?: string | null,
  oldPassword: string
}



export const LoginTeach = async (for_user: LoginUserData) => {
  try {
    const response = await client.post("/api/auth/login", {
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
    const response = await client.post("/api/auth/logout");
    return response.data.message;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка"
    }
  }
}

export const ChangeTeacherInfo = async (for_user: TeacherChangeData) => {
  try {
    console.log(for_user)
    const response = await client.patch("/api/auth/change", for_user);
    toast.success('Данные преподавателя изменены');
    return { succes: true, data: response.data };
  } catch (error: any) {
    console.log(error)
    toast.error(error.response.data.message)
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