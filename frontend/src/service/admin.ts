import { toast } from "react-toastify";
import client from "./client";
import role from "../types/role";
import { StudentData } from "../interfaces/student";

interface CreateTeacher{
  email:string;
  password:string;
  name:string;
  role:"teacher";
  lessonsIds:number[];
}

interface AddLessonForTeacher{
  lessonsIds:number[];
  idTeacher:number;
}
interface UpdateUser{
  email:string;
  name:string;
  password:string;
  role:role;
  idUser:number;
}
interface UpdateStudent{
  id:number;
  name:string;
  groupsId: number
}
interface UpdateGroup{
  id:number;
  name:string;
}


interface UpdateLesson{
  id:number;
  name:string;
}


export const CreateTeacher = async (for_user:CreateTeacher) => {
  try {
    const response = await client.post("/api/admin/users", for_user);
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const getAllTeachers = async () => {
  try {
    const response = await client.get(`/api/admin/users`);
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
};

export const addLessonsForTeacher = async (for_user:AddLessonForTeacher) => {
  try {
    const response = await client.post(`/api/admin/users/${for_user.idTeacher}/lessons`, for_user);
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const deleteLessonforTeacher = async (idTeacher: number) => {
  try {
    const response = await client.delete(`/api/lessons/${idTeacher}`)
    toast.success('Предмет у учителя успешно удален')
    return response.data;
  } catch (error) {
    toast.error(Object(error).response.data.message);
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}

export const getUserById = async (idUser:number) => {
  try {
    const response = await client.get(`/api/admin/users/${idUser}`);
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
};

export const updateUserById = async (for_user:UpdateUser) => {
  try {
    const response = await client.patch(`/api/admin/users/${for_user.idUser}`,for_user)
    toast.success("Название предмета успешно измененно")
    return response.data;
  } catch (error) {
    toast.error(Object(error).response.data.message);
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}

export const deleteUserById = async (idUser: number) => {
  try {
    const response = await client.delete(`/api/admin/users/${idUser}`)
    toast.success('Предмет у учителя успешно удален')
    return response.data;
  } catch (error) {
    toast.error(Object(error).response.data.message);
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}
//добавил к названию single
export const AddStudentSingle = async (exported_students: StudentData[]) => {
  try {
    const response = await client.post("/api/admin/students", {
      students: exported_students,
    });
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const GetAllStudents = async () => {
  try {
    const response = await client.get("/api/admin/students");
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};
//many добавил
export const AddStudentMany = async (exported_students: StudentData[]) => {
  try {
    const response = await client.post("/api/admin/students/many", {
      students: exported_students,
    });
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const getStudentById= async (idStud:number) => {
  try {
    const response = await client.get(`/api/admin/students/${idStud}`);
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
};

export const updateStudent = async (student: UpdateStudent) => {
  try {
    const response = await client.patch(`/api/admin/students/${student.id}`,student)
    toast.success("Cтудент успешно изменён");
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
    const response = await client.delete(`/api/admin/students/${studentId}`)
    toast.success('Студент успешно удален')
    return response.data;
  } catch (error) {
    toast.error(Object(error).response.data.message);
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}

export const GetInfoAboutStudent= async (studentId:number) => {
  try {
    const response = await client.get(`/api/admin/students/${studentId}/credentials`);
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const CreateGroup = async (groupName: string) => {
  try {
    const response = await client.post("/api/admin/groups", { name: groupName });
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const GetAllGroups = async () => {
  try {
    const response = await client.get("/api/admin/groups");
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};
export const GetGroupById = async (groupId:number) => {
  try {
    const response = await client.get(`/api/admin/groups/${groupId}`);
    return { succes: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const updateGroup = async (group: UpdateGroup) => {
  try {
    const response = await client.patch(`/api/admin/groups/${group.id}`, group)
    toast.success('Название группы успешно изменено');
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
    const response = await client.delete(`/api/admin/groups/${groupId}`)
    toast.success('Группа успешна удалена')
    return response.data;
  } catch (error) {
    toast.error(Object(error).response.data.message);
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}

export const addLesson = async (name: string) => {
  try {
    const response = await client.post(`/api/admin/lessons`, {
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

export const getLessons = async () => {
  try {
    const response = await client.get(`/api/admin/lessons`);
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
};

export const updateLesson = async (lesson: UpdateLesson) => {
  try {
    const response = await client.patch(`/api/admin/lessons/${lesson.id}`,lesson)
    toast.success("Название предмета успешно измененно")
    return response.data;
  } catch (error) {
    toast.error(Object(error).response.data.message);
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}

export const deleteLesson = async (lessonId: number) => {
  try {
    const response = await client.delete(`/api/admin/lessons/${lessonId}`)
    toast.success('Предмет успешно удален')
    return response.data;
  } catch (error) {
    toast.error(Object(error).response.data.message);
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка",
    };
  }
}