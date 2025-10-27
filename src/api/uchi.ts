import { api } from ".";

export const uchiTemporarySave = (payload: any) => {
  return api.post("/uchi/sync", payload).then((resp) => resp.data);
};
