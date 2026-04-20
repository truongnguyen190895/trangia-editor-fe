export const GENDER = {
  MALE: "Ông",
  FEMALE: "Bà",
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

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
}
