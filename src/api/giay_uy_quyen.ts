import { api } from ".";
import type { GiayUyQuyen } from "@/models/guq";

export const generateGiayUyQuyen = (payload: GiayUyQuyen) => {
  const url = "/templates/guq/guq-cm";
  return api.post(url, payload, { responseType: "blob" });
};
