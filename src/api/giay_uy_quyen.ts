import { api } from ".";
import { GUQ_TEMPLATE, type GiayUyQuyen, type GuqTemplate } from "@/models/guq";
import { convertEmptyStringsToNull } from "@/utils/common";

export const generateGiayUyQuyen = (
  payload: GiayUyQuyen,
  template: GuqTemplate = GUQ_TEMPLATE.CM,
) => {
  const multiFrom = payload.bên_B.cá_thể?.length > 1;
  const multiTo = payload.người_được_uỷ_quyền.length > 1;

  const effectiveTemplate =
    template === GUQ_TEMPLATE.VAC && multiFrom
      ? GUQ_TEMPLATE.VAC_MULTIPLE
      : template === GUQ_TEMPLATE.VAN_DINH && multiFrom
        ? GUQ_TEMPLATE.VAN_DINH_MULTIPLE
        : template;
  const url = `/templates/guq/${effectiveTemplate}`;

  const extras =
    template === GUQ_TEMPLATE.CM
      ? {
          lời_xưng_hô: multiFrom ? "Chúng tôi là:" : "Tôi là:",
          nhiều_người_được_uỷ_quyền: multiTo,
        }
      : {
          nhiều_người_được_uỷ_quyền: multiTo,
        };

  return api.post(
    url,
    convertEmptyStringsToNull({ ...payload, ...extras }),
    { responseType: "blob" },
  );
};

/**
 * Reads the contract name from the source contract's "LỜI CHỨNG ... CHỨNG NHẬN:" section,
 * e.g. "Hợp đồng chuyển nhượng quyền sử dụng đất (Chuyển nhượng một phần)". Used to print the
 * exact same name on the giấy uỷ quyền (tên_hợp_đồng).
 */
export const getContractName = async (
  contractTemplatePath: string,
): Promise<string> => {
  const { data } = await api.get<string>(
    `/templates/loi-chung/${contractTemplatePath}`,
    { responseType: "text" },
  );
  return (data ?? "").trim();
};
