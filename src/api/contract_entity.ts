import { api } from ".";

export const saveContractEntity = (id: string, payload: any) => {
  return api.put(`/entities/${id}`, payload).then((resp) => resp.data);
};

export const getContractEntity = (id: string) => {
  return api.get(`/entities/${id}`).then((resp) => resp.data);
};