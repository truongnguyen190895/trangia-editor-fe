export const GENDER = {
  MALE: "Ông",
  FEMALE: "Bà",
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

export interface AgreementEntity extends BaseAgreementParty {
  tình_trạng_hôn_nhân?: string;
  quan_hệ?: string;
  giấy_chứng_nhận_kết_hôn?: {
    số_giấy_chứng_nhận: string;
    quyển_số: string;
    nơi_cấp: string;
    ngày_cấp: string;
  };
}

interface BaseAgreementParty {
  giới_tính: Gender;
  tên: string;
  ngày_sinh: string;
  loại_giấy_tờ: string;
  số_giấy_tờ: string;
  ngày_cấp: string;
  nơi_cấp: string;
  địa_chỉ_thường_trú_cũ: string;
  địa_chỉ_thường_trú_mới: string;
}

export interface SingleAgreementParty extends BaseAgreementParty {
  tình_trạng_hôn_nhân?: string;
}

export interface CoupleAgreementParty extends BaseAgreementParty {
  quan_hệ?: string;
  giấy_chứng_nhận_kết_hôn?: {
    số_giấy_chứng_nhận: string;
    quyển_số: string;
    nơi_cấp: string;
    ngày_cấp: string;
  };
}

export interface Couple {
  chồng: CoupleAgreementParty;
  vợ: CoupleAgreementParty;
}

export interface AgreementParty {
  cá_nhân: SingleAgreementParty[];
  vợ_chồng: Couple[];
}

interface BaseThuaDat {
  số_thửa_đất: string;
  tờ_bản_đồ: string;
  địa_chỉ_cũ: string;
  địa_chỉ_mới: string;
  loại_giấy_chứng_nhận: string;
  số_giấy_chứng_nhận: string;
  số_vào_sổ_cấp_giấy_chứng_nhận: string;
  nơi_cấp_giấy_chứng_nhận: string;
  ngày_cấp_giấy_chứng_nhận: string;
  đặc_điểm_thửa_đất: {
    diện_tích: {
      số: string;
      chữ: string;
    };
    hình_thức_sử_dụng: string;
    mục_đích_và_thời_hạn_sử_dụng: Array<{
      phân_loại: string;
      diện_tích?: string;
      thời_hạn_sử_dụng: string;
    }>;
    nguồn_gốc_sử_dụng: string;
    ghi_chú: string;
  };
  số_tiền: string;
  số_tiền_bằng_chữ: string;
}

export interface HDCNQuyenSDDatPayload extends BaseThuaDat {
  bên_A: {
    cá_thể: Array<{
      giới_tính: Gender;
      tên: string;
      ngày_sinh: string;
      loại_giấy_tờ: string;
      số_giấy_tờ: string;
      nơi_cấp: string;
      ngày_cấp: string;
      địa_chỉ_thường_trú_cũ: string;
      địa_chỉ_thường_trú_mới: string;
      quan_hệ?: string;
    }>;
  };
  bên_B: {
    cá_thể: Array<{
      giới_tính: Gender;
      tên: string;
      ngày_sinh: string;
      loại_giấy_tờ: string;
      số_giấy_tờ: string;
      nơi_cấp: string;
      ngày_cấp: string;
      địa_chỉ_thường_trú_cũ: string;
      địa_chỉ_thường_trú_mới: string;
      tình_trạng_hôn_nhân?: string;
    }>;
  };
  ngày: string;
  ngày_bằng_chữ: string;
  số_bản_gốc: string;
  số_bản_gốc_bằng_chữ: string;
  ký_bên_ngoài: boolean;
}

export interface ToKhaiChungPayload extends BaseThuaDat {
  bên_A: {
    cá_thể: Array<{
      giới_tính: Gender;
      tên: string;
      ngày_sinh: string;
      loại_giấy_tờ: string;
      số_giấy_tờ: string;
      nơi_cấp: string;
      ngày_cấp: string;
      địa_chỉ_thường_trú_cũ: string;
      địa_chỉ_thường_trú_mới: string;
      tình_trạng_hôn_nhân?: string;
      quan_hệ?: string;
      thôn?: string;
      phường?: string;
      tỉnh?: string;
    }>;
  };
  bên_B: {
    cá_thể: Array<{
      giới_tính: Gender;
      tên: string;
      ngày_sinh: string;
      loại_giấy_tờ: string;
      số_giấy_tờ: string;
      nơi_cấp: string;
      ngày_cấp: string;
      địa_chỉ_thường_trú_cũ: string;
      địa_chỉ_thường_trú_mới: string;
      tình_trạng_hôn_nhân?: string;
      thôn?: string;
      phường?: string;
      tỉnh?: string;
    }>;
  };
  bảng_tncn_bên_A: { stt: number; tên: string; số_giấy_tờ: string }[];
  bảng_trước_bạ_bên_B: { stt: number; tên: string; số_giấy_tờ: string }[];
  tables: ["bảng_tncn_bên_A", "bảng_trước_bạ_bên_B"];
}
