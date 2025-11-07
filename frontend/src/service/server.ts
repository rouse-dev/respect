import { toast } from "react-toastify";
import client from "./client";
import { StudentData } from "../interfaces/student";



interface UpdateGroup{
  id:number;
  name:string;
}

interface UpdateStudent{
  id:number;
  name:string;
  groupsId: number
}
interface UpdateLesson{
  id:number;
  name:string;
}




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





export const AddStudent = async (exported_students: StudentData[]) => {
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


export const deleteLesson = async (lessonId: number) => {
  try {
    const response = await client.delete(`/api/lessons/${lessonId}`)
    toast.success('Предмет успешно удален')
    return response.data;
  } catch (error) {
    toast.error(Object(error).response.data.message);
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}
export const deleteStudent = async (studentId: number) => {
  try {
    const response = await client.delete(`/api/students/${studentId}`)
    toast.success('Студент успешно удален')
    return response.data;
  } catch (error) {
    toast.error(Object(error).response.data.message);
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}
export const deleteGroup = async (groupId: number) => {
  try {
    const response = await client.delete(`/api/groups/${groupId}`)
    toast.success('Группа успешна удалена')
    return response.data;
  } catch (error) {
    toast.error(Object(error).response.data.message);
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}


export const updateLesson = async (lesson: UpdateLesson) => {
  try {
    const response = await client.patch(`/api/lessons/${lesson.id}`,lesson)
    toast.success("Название предмета успешно измененно")
    return response.data;
  } catch (error) {
    toast.error(Object(error).response.data.message);
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}

export const updateStudent = async (student: UpdateStudent) => {
  try {
    const response = await client.patch(`/api/students/${student.id}`,student)
    toast.success("Cтудент успешно изменён");
    return response.data;
  } catch (error) {
    toast.error(Object(error).response.data.message);
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}
export const updateGroup = async (group: UpdateGroup) => {
  try {
    const response = await client.patch(`/api/groups/${group.id}`, group)
    toast.success('Название группы успешно изменено');
    return response.data;
  } catch (error) {
    toast.error(Object(error).response.data.message);
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}