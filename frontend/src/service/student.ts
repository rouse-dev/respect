import { toast } from "react-toastify";
import client from "./client";

interface DebtCreate {
    lessonId: number;
    points:number;
    description:string;
}

export const DebtCreate = async (for_user: DebtCreate) => {
  try {
    const response = await client.post("/api/students/debt-requests", {
      lessonId: for_user.lessonId,
      points: for_user.points,
      description: for_user.description
    });
    toast.success("Ваше списание отправлено на рассмотрение");
    return { success: true, data: response.data };
  } catch (error) {
    toast.error("Неправльные данные")
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};
export const GetAllDebt = async () => {
  try {
    const response = await client.get("/api/students/debt-requests");
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};
export const GetAllDebtById = async (debtId:number) => {
  try {
    const response = await client.get( `/api/students/debt-requests/${debtId}`);
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};