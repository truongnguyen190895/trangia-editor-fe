import type { Gender } from "./agreement-entity";

interface BaseParty {
  giới_tính: Gender;
  tên: string;
  ngày_sinh: string;
  loại_giấy_tờ: string;
  số_giấy_tờ: string;
  ngày_cấp: string;
  nơi_cấp: string;
  địa_chỉ_thường_trú: string;
  tình_trạng_hôn_nhân: string | null;
  tình_trạng_hôn_nhân_vợ_chồng: string | null;
  quan_hệ: string | null;
  thành_phố: string | null;
  phường: string | null;
  thôn: string | null;
}

interface Party {
  cá_thể: BaseParty[];
}

export interface HDMBNhaDatPayload extends ThongTinThuaDat, ThongTinNhaDat {
  bên_A: Party;
  bên_B: Party;
  ngày: string;
  ngày_bằng_chữ: string;
  số_bản_gốc: string;
  số_bản_gốc_bằng_chữ: string;
  số_bản_công_chứng: string;
  số_bản_công_chứng_bằng_chữ: string;
  ký_bên_ngoài: boolean;
}

export interface ThongTinThuaDat {
  số_thửa_đất: string;
  số_tờ_bản_đồ: string | null;
  địa_chỉ_nhà_đất: string;
  diện_tích_đất_bằng_số: string;
  diện_tích_đất_bằng_chữ: string;
  hình_thức_sở_hữu_đất: string;
  mục_đích_sở_hữu_đất: string;
  thời_hạn_sử_dụng_đất: string;
  nguồn_gốc_sử_dụng_đất: string;
  loại_gcn: string;
  số_gcn: string;
  số_vào_sổ_cấp_gcn: string;
  nơi_cấp_gcn: string;
  ngày_cấp_gcn: string;
}

export interface ThongTinNhaDat {
  diện_tích_xây_dựng: string;
  diện_tích_sàn: string;
  số_tầng: string | null;
  kết_cấu: string | null;
  cấp_hạng: string | null;
  năm_hoàn_thành_xây_dựng: string | null;
  số_tiền: string;
  số_tiền_bằng_chữ: string;
  ghi_chú: string;
  loại_nhà_ở: string | null;
  hình_thức_sở_hữu: string;
}

export interface KhaiThueHDMBNhaDatToanBoPayload {
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
  số_giấy_chứng_nhận: string;
  nơi_cấp_giấy_chứng_nhận: string;
  ngày_cấp_giấy_chứng_nhận: string;
  ngày_chứng_thực: string | null;
  số_thửa_đất: string;
  số_tờ_bản_đồ: string | null;
  thôn: string | null;
  phường: string | null;
  thành_phố: string | null;
  đặc_điểm_thửa_đất: {
    mục_đích_và_thời_hạn_sử_dụng: Array<{
      phân_loại: string;
      diện_tích: string | null;
    }>;
    nguồn_gốc_sử_dụng: string | null;
    diện_tích: {
      số: string;
    };
  };
  số_tiền: string | null;
  diện_tích_xây_dựng: string;
  diện_tích_sàn: string;
  cấp_hạng: string | null;
  nguồn_gốc_sử_dụng_đất: string | null;
  năm_hoàn_thành_xây_dựng: string | null;
  loại_nhà_ở: string | null;
}
