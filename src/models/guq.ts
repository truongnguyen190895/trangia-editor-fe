export const GENDER = {
  MALE: "Ông",
  FEMALE: "Bà",
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

export const GUQ_TEMPLATE = {
  CM: "guq-cm",
  VAC: "guq-vac",
  VAC_MULTIPLE: "guq-vac-multiple",
  VAN_DINH: "guq-van-dinh",
  VAN_DINH_MULTIPLE: "guq-van-dinh-multiple",
} as const;
export type GuqTemplate = (typeof GUQ_TEMPLATE)[keyof typeof GUQ_TEMPLATE];

// guq-van-dinh là biến thể của guq-vac dành cho chi nhánh Vân Đình (VĐ): cùng payload,
// khác công chứng viên và địa chỉ trong lời chứng.
export const isVacLikeTemplate = (template: GuqTemplate): boolean =>
  template === GUQ_TEMPLATE.VAC || template === GUQ_TEMPLATE.VAN_DINH;

export interface GiayUyQuyen {
  bên_B: {
    cá_thể: Array<{
      giới_tính: Gender;
      tên: string;
      ngày_sinh: string;
      loại_giấy_tờ: string;
      số_giấy_tờ: string;
      nơi_cấp: string;
      ngày_cấp: string;
      địa_chỉ_thường_trú: string;
      quan_hệ: string | null;
      tình_trạng_hôn_nhân: string | null;
      tình_trạng_hôn_nhân_vợ_chồng: string | null;
    }>;
  };
  địa_chỉ_hiển_thị: string;
  loại_giấy_chứng_nhận: string;
  số_giấy_chứng_nhận: string;
  số_vào_sổ_cấp_giấy_chứng_nhận: string;
  nơi_cấp_giấy_chứng_nhận: string;
  ngày_cấp_giấy_chứng_nhận: string;
  nguoi_duoc_uq: Array<{
    giới_tính: Gender;
    tên: string;
    ngày_sinh: string;
    loại_giấy_tờ: string;
    số_giấy_tờ: string;
    nơi_cấp: string;
    ngày_cấp: string;
  }>;

  số_thửa_đất?: string;
  số_tờ_bản_đồ?: string;
  tên_hợp_đồng?: string;
  ngày?: string;
  tháng?: string;
  năm?: string;
  giờ_soạn?: string;
  phút_soạn?: string;
  ngày_bằng_chữ?: string;
  tháng_bằng_chữ?: string;
  năm_bằng_chữ?: string;
  isSingleFrom?: boolean;
}
