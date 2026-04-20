import { api } from ".";
import type { GiayUyQuyen } from "@/models/guq";
import { convertEmptyStringsToNull } from "@/utils/common";

export const generateGiayUyQuyen = (payload: GiayUyQuyen) => {
  const url = "/templates/guq/guq-cm";
  const isMultipleFrom =
    payload.bên_B.cá_thể?.length > 1 ? "Chúng tôi là:" : "Tôi là:";
  const isMultipleTo = payload.nguoi_duoc_uq.length > 1;
  return api.post(
    url,
    convertEmptyStringsToNull({ ...payload, isMultipleFrom, isMultipleTo }),
    { responseType: "blob" },
  );
};
