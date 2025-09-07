import { api } from "./index";

interface LoginDTO {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  authorities: Array<{
    authority: string;
  }>;
  user: {
    is_admin: boolean;
    name: string;
    role: string;
  };
}

export const login = (loginDTO: LoginDTO): Promise<LoginResponse> => {
  return api.post("/auth/login", loginDTO).then((res) => res.data);
};
