import { api } from ".";

export interface Notary {
  value: number;
  label: string;
}

export const uchiTemporarySave = (payload: any) => {
  return api.post("/uchi/sync", payload).then((resp) => resp.data);
};

export const listNotaries = (): Promise<Notary[]> => {
  return api.get("/uchi/cong-chung-vien").then((resp) => resp.data);
};
