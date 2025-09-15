import { api } from ".";

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

export const listUsers = (): Promise<ListUsersResponse> => {
  return api.get("/users?size=1000").then((resp) => resp.data);
};
