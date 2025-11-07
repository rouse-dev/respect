import client from "./client";


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