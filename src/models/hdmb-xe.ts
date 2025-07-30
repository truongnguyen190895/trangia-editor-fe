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
}

interface Party {
  cá_thể: BaseParty[];
}

export interface ThongTinXeOto {
  nhãn_hiệu: string;
  màu_sơn: string;
  loại_xe: string;
  số_máy: string;
  số_khung: string;
  biển_số: string;
  số_loại: string | null;
  số_đăng_ký: string;
  nơi_cấp: string;
  ngày_đăng_ký_lần_đầu: string | null;
  ngày_đăng_ký: string;
  số_tiền: string;
  số_tiền_bằng_chữ: string;
}

export interface HDMBXeOtoPayload extends ThongTinXeOto {
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
