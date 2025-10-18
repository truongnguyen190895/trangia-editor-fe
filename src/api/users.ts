import { api } from ".";
import type { Branch } from "./branchs";

export interface User {
  username: string;
  role: string;
  name: string;
  uchi_username: string | null;
  is_admin: boolean;
  enabled: boolean;
  account_non_expired: boolean;
  account_non_locked: boolean;
  credentials_non_expired: boolean;
  branches: Branch[];
}

export interface ListUsersResponse {
  content: User[];
  page: {
    number: number;
    size: number;
    total_elements: number;
    total_pages: number;
  };
}

export interface UpdateUserPayload {
  username: string;
  password: string;
}

export const listUsers = (): Promise<ListUsersResponse> => {
  return api.get("/users?size=1000").then((resp) => resp.data);
};

export const getUser = (username: string): Promise<User> => {
  return api.get(`/users/${username}`).then((resp) => resp.data);
};

export const updateUser = (user: UpdateUserPayload): Promise<User> => {
  return api.patch(`/users/self`, user).then((resp) => resp.data);
};
