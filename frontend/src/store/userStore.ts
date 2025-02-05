import { makeAutoObservable } from "mobx";
import { LoginTeach } from "../service/server";


interface ILoginInfo {
  email: string;
  password: string;
}

interface ILoginResponse {
  success?: boolean;
  data?: {
    teacher: {
      name: string;
      email: string;
    };
    accessToken: string;
  };
}

class UserStore {
  username: string = "";
  email: string = "";
  isAuth: boolean = false;
  token: string = "";

  constructor() {
    makeAutoObservable(this);
    this.checkAuth();
  }

  checkAuth(): void {
    const isAuth = localStorage.getItem("isAuth");
    if (isAuth === "true") {
      this.isAuth = true;
      const userData = localStorage.getItem("userData");
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");
      if (userData && username && email) {
        this.username = username;
        this.email = email;
        this.token = userData;
      }
    }
  }

  logoutUser(): void {
    this.isAuth = false;
    this.username = "";
    this.email = "";
    this.token = "";
    localStorage.removeItem("userData");
    localStorage.removeItem("isAuth");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
  }

  async authUser(userInfo: ILoginInfo): Promise<void> {
    try {
      const response: ILoginResponse = await LoginTeach(userInfo);
      if (response.success && response.data) {
        const userData = response.data;
        this.username = userData.teacher.name;
        this.email = userData.teacher.email;
        this.token = userData.accessToken;
        this.isAuth = true;

        localStorage.setItem("userData", userData.accessToken);
        localStorage.setItem("username", userData.teacher.name);
        localStorage.setItem("email", userData.teacher.email);
        localStorage.setItem("isAuth", "true");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  }
}

const userStore = new UserStore();
export default userStore;