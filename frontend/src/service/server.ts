import axios from "axios";

interface UserData {
  avatar: any;
  email: string;
  password: string;
  name: string;
}

interface LoginUserData {
  email: string,
  password: string,
}

interface StudentData {
  name: string;
  groupsId: string;
}

interface ChangeRespectData {
  studentId: number,
  change: number,
  reason: string,
  lessonId: number,
}

const getToken = () => {
  const userData = localStorage.getItem("userData");
  if (!userData) {
    throw new Error("Токен отсутствует в localStorage");
  }
  return userData;
};

export const RegisterTeach = async (for_user: UserData) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/teachers/register",
      {
        email: for_user.email,
        password: for_user.password,
        name: for_user.name,
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

export const LoginTeach = async (for_user: LoginUserData) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/teachers/login",
      {
        email: for_user.email,
        password: for_user.password,
      }
    );
    console.log(response.data);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произошла ошибка",
    };
  }
};

export const ChangeAvatar = async (for_user: UserData) => {
  try {
    const response = await axios.patch(
      "http://localhost:3000/api/teachers/avatar",
      {
        avatar: for_user.avatar,
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

export const GetAllStudents = async () => {
  try {
    const token = getToken();
    const response = await axios.get("http://localhost:3000/api/students", {
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
      "http://localhost:3000/api/groups",
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
    const response = await axios.get("http://localhost:3000/api/groups", {
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

export const ChangeRespect = async (
  newRep: ChangeRespectData
) => {
  try {
    const token = getToken();
    const response = await axios.patch(
      `http://localhost:3000/api/students/${newRep.studentId}/reputation`,
      newRep,
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

export const HistoryStudent = async (studentId: string) => {
  try {
    const token = getToken();
    const response = await axios.get(
      `http://localhost:3000/api/students/${studentId}/history`,
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
export const AddStudent = async (for_user: StudentData) => {
  try {
    const token = getToken();
    const response = await axios.post(
      "http://localhost:3000/api/students",
      { name: for_user.name, groupsId: for_user.groupsId },
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

export const getLessons = async () => {
  try {
    const token = getToken();
    const response = await axios.get(
      `http://localhost:3000/api/lessons`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка"
    }
  }
}

export const addLesson = async (name: string) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `http://localhost:3000/api/lessons`,
      {
        name
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Предмет успешно создан!')
    return response.data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Произшла ошибка"
    }
  }
}