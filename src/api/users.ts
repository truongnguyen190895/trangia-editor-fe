import { api } from ".";
import type { Branch } from "./branchs";

export interface User {
  username: string;
  role: string;
  name: string;
  uchi_username: string | null;
  is_admin: boolean;
  active: boolean;
  account_non_expired: boolean;
  account_non_locked: boolean;
  credentials_non_expired: boolean;
  branches: Branch[];
}

export interface CreateUserPayload {
  username: string;
  password: string;
  name: string;
  role: string;
  branches: string[];
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
  branches?: string[];
  role?: string;
  password?: string;
  active?: boolean;
  name?: string;
}

interface ListUsersParams {
  employee?: boolean;
  search?: string;
}

export const listUsers = (
  params?: ListUsersParams
): Promise<ListUsersResponse> => {
  return api.get("/users", { params }).then((resp) => resp.data);
};

export const getUser = (username: string): Promise<User> => {
  return api.get(`/users/${username}`).then((resp) => resp.data);
};

export const updateUser = (user: UpdateUserPayload): Promise<User> => {
  return api.patch(`/users/self`, user).then((resp) => resp.data);
};

export const createUser = (user: CreateUserPayload): Promise<User> => {
  return api
    .post(`/users`, user)
    .then((resp) => resp.data)
    .catch((err) => {
      throw err.response.data;
    });
};

export const updateEmployee = (user: UpdateUserPayload): Promise<User> => {
  return api.patch(`/users/${user.username}`, user).then((resp) => resp.data);
};

export const toggleUserActive = (
  username: string,
  active: boolean
): Promise<User> => {
  return api.patch(`/users/${username}`, { active }).then((resp) => resp.data);
};
