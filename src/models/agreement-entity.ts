export const GENDER = {
  MALE: "Ông",
  FEMALE: "Bà",
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

interface BaseAgreementParty {
  giới_tính: Gender;
  tên: string;
  ngày_sinh: string;
  loại_giấy_tờ: string;
  số_giấy_tờ: string;
  ngày_cấp: string;
  nơi_cấp: string;
  địa_chỉ_thường_trú: string
}

export interface SingleAgreementParty extends BaseAgreementParty {
  tình_trạng_hôn_nhân: string | null;
  quan_hệ: string | null;
}

export interface CoupleAgreementParty extends BaseAgreementParty {
  quan_hệ: string | null;
  tình_trạng_hôn_nhân_vợ_chồng: string | null;
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
  số_tờ_bản_đồ: string;
  địa_chỉ_cũ: string | null;
  địa_chỉ_mới: string;
  địa_chỉ_hiển_thị: string;
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
      diện_tích: string | null;
      thời_hạn_sử_dụng: string;
    }>;
    nguồn_gốc_sử_dụng: string | null;
    ghi_chú: string;
    thời_hạn: string | null;
  };
  đặc_điểm_một_phần_thửa_đất?: {
    diện_tích: {
      số: string;
      chữ: string;
    };
    mục_đích_và_thời_hạn_sử_dụng: Array<{
      phân_loại: string;
      diện_tích: string | null;
      thời_hạn_sử_dụng: string;
    }>;
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
      địa_chỉ_thường_trú: string;
      quan_hệ: string | null;
      tình_trạng_hôn_nhân: string | null;
      tình_trạng_hôn_nhân_vợ_chồng: string | null;
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
      địa_chỉ_thường_trú: string;
      quan_hệ: string | null;
      tình_trạng_hôn_nhân: string | null;
      tình_trạng_hôn_nhân_vợ_chồng: string | null;
    }>;
  };
  // Top-level partial-area keys used by the "có công văn" tặng cho template,
  // whose placeholders are not nested under đặc_điểm_một_phần_thửa_đất.
  một_phần_diện_tích?: string;
  một_phần_diện_tích_bằng_chữ?: string;
  mục_đích_và_thời_hạn_sử_dụng?: Array<{
    phân_loại: string;
    diện_tích: string | null;
    thời_hạn_sử_dụng: string;
  }>;
  // Chi tiết riêng cho ĐIỀU 1 mục 1 của mẫu "có công văn" (gate bằng isCoCongVan).
  số_quyết_định?: string;
  nơi_đăng_ký_chuyển_mục_đích?: string;
  ngày_đăng_ký_chuyển_mục_đích?: string;
  giới_hạn_các_điểm?: string;
  loại_sơ_đồ?: string;
  số_sơ_đồ?: string;
  đơn_vị_lập_sơ_đồ?: string;
  ngày_lập_sơ_đồ?: string;
  số_công_văn?: string;
  cơ_quan_công_văn?: string;
  ngày_lập_công_văn?: string;
  ngày: string;
  ngày_bằng_chữ: string;
  số_bản_gốc: string;
  số_bản_gốc_bằng_chữ: string;
  số_bản_công_chứng: string;
  số_bản_công_chứng_bằng_chữ: string;
  ký_bên_ngoài: boolean;
  công_chứng_viên: string;
  template_id?: number | string;
  số_hợp_đồng?: string;
  isUchi: boolean;
  uchi_id?: string;
  notary_id?: string;
  template_name?: string;
  original_payload?: any;
  id?: string;
}

export type SampleToKhaiChungPayload = {
  bên_A: {
    cá_thể: Array<{
      giới_tính: Gender;
      tên: string;
      ngày_sinh: string;
      loại_giấy_tờ: string;
      số_giấy_tờ: string;
      ngày_cấp: string;
      nơi_cấp: string;
      địa_chỉ_thường_trú: string;
      tình_trạng_hôn_nhân: string | null;
      quan_hệ: string | null;
      thành_phố: string | null;
      phường: string | null;
      thôn: string | null;
    }>;
  };
  bên_B: {
    cá_thể: Array<{
      giới_tính: Gender;
      tên: string;
      ngày_sinh: string;
      loại_giấy_tờ: string;
      số_giấy_tờ: string;
      ngày_cấp: string;
      nơi_cấp: string;
      địa_chỉ_thường_trú: string;
      tình_trạng_hôn_nhân: string | null;
      quan_hệ: string | null;
      thành_phố: string | null;
      phường: string | null;
      thôn: string | null;
    }>;
  };
  bảng_tncn_bên_A: Array<{
    stt: number;
    tên: string;
    số_giấy_tờ: string;
  }>;
  bảng_trước_bạ_bên_B: Array<{
    stt: number;
    tên: string;
    số_giấy_tờ: string;
  }>;
  bảng_bên_A: Array<{
    stt: number;
    tên: string;
  }>;
  tables: ["bảng_bên_A", "bảng_tncn_bên_A", "bảng_trước_bạ_bên_B"];
  loại_giấy_tờ: string;
  số_giấy_chứng_nhận: string;
  nơi_cấp_giấy_chứng_nhận: string;
  ngày_cấp_giấy_chứng_nhận: string;
  ngày_lập_hợp_đồng: string;
  ngày_chứng_thực: string;
  số_thửa_đất: string;
  số_tờ_bản_đồ: string;
  thôn: string | null;
  phường: string | null;
  thành_phố: string | null;
  địa_chỉ_hiển_thị: string;
  đặc_điểm_thửa_đất: {
    hình_thức_sử_dụng: string;
    mục_đích_và_thời_hạn_sử_dụng: Array<{
      phân_loại: string;
      diện_tích: string | null;
    }>;
    nguồn_gốc_sử_dụng: string | null;
    thời_hạn: string | null;
    diện_tích: {
      số: string;
    };
    diện_tích_phi_nông_nghiệp: string;
  };
  số_tiền: string;
};