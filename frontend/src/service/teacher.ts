import { toast } from "react-toastify";
import client from "./client";


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

interface DebtI{
    id:number;
    comment:string;
}

export const GetAllGroups = async () => {
  try {
    const response = await client.get("/api/teachers/groups");
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const getLessons = async () => {
  try {
    const response = await client.get(`/api/teachers/lessons`);
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
};


export const GetAllStudents = async () => {
  try {
    const response = await client.get("/api/teachers/students");
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const HistoryStudent = async (studentId: number) => {
  try {
    const response = await client.get(`/api/teachers/students/${studentId}/history`);  
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const exportHistoryExcel = async (studentId: number) => {
  try {
    const response = await client.get(`/api/teachers/students/${studentId}/history/excel`, { responseType: 'blob' })
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}
// Тут новое название
export const ChangeRespectAdd = async (newRep: ChangeRespectData) => {
  try {
    const response = await client.post(
      `/api/teachers/students/${newRep.studentId}/reputation/add`,
      newRep
    );
    return { succes: true, data: response };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};
// Тут новое название
export const ChangeRespectRemove = async (newRep: ChangeRespectData) => {
  try {
    const response = await client.patch(
      `/api/teachers/students/${newRep.studentId}/reputation/remove`,
      newRep
    );
    return { succes: true, data: response };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

// этих 4 запросов пока нету
export const GetAllDebt = async()=>{
    try {
        const response = await client.get("/api/teachers/debt-requests");
        return {success: true, data:response.data}
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Произошла ошибка",
        };
    }
}

export const GetDebtById = async(debtId:number)=>{
    try {
        const response = await client.get(`/api/teachers/debt-requests/${debtId}`);
        return {success:true, data:response.data}
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Произошла ошибка",
        };
    }
}

export const AcceptDebt = async (debt: DebtI) => {
  try {
    const response = await client.patch(`/api/teachers/debt-requests/${debt.id}/accept`,debt)
    toast.success("Заявка успешно принята")
    return response.data;
  } catch (error) {
    toast.error(Object(error).response.data.message);
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}
export const RejectDebt = async (debt: DebtI) => {
  try {
    const response = await client.patch(`/api/teachers/debt-requests/${debt.id}/reject`,debt)
    toast.success("Заявка отклонена")
    return response.data;
  } catch (error) {
    toast.error(Object(error).response.data.message);
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}