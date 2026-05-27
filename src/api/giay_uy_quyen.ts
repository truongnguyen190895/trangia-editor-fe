import { api } from ".";
import { GUQ_TEMPLATE, type GiayUyQuyen, type GuqTemplate } from "@/models/guq";
import { convertEmptyStringsToNull } from "@/utils/common";

export const generateGiayUyQuyen = (
  payload: GiayUyQuyen,
  template: GuqTemplate = GUQ_TEMPLATE.CM,
) => {
  const multiFrom = payload.bên_B.cá_thể?.length > 1;
  const isMultipleTo = payload.nguoi_duoc_uq.length > 1;

  const effectiveTemplate =
    template === GUQ_TEMPLATE.VAC && multiFrom
      ? GUQ_TEMPLATE.VAC_MULTIPLE
      : template;
  const url = `/templates/guq/${effectiveTemplate}`;

  const extras =
    template === GUQ_TEMPLATE.CM
      ? {
          isMultipleFrom: multiFrom ? "Chúng tôi là:" : "Tôi là:",
          isMultipleTo,
        }
      : {
          isMultipleFrom: multiFrom,
          isSingleFrom: !multiFrom,
          isMultipleTo,
        };

  return api.post(
    url,
    convertEmptyStringsToNull({ ...payload, ...extras }),
    { responseType: "blob" },
  );
};
