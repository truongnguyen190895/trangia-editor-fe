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
  số_tầng: string;
  kết_cấu: string;
  cấp_hạng: string;
  năm_hoàn_thành_xây_dựng: string;
  số_tiền: string;
  số_tiền_bằng_chữ: string;
  ghi_chú: string;
}
