import { api } from ".";

export interface Branch {
  id: string;
  friendly_name: string;
}

export const listBranches = (): Promise<Branch[]> => {
  return api.get("/branches").then((resp) => resp.data);
};