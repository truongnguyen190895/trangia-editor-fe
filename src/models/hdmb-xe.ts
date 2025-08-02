import type { Party } from "./party";

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
  số_bằng_chứng_trúng_đấu_giá?: string | null;
  nơi_cấp_đấu_giá: string | null;
  ngày_trúng_đấu_giá: string | null;
  // liên quan đến uỷ quyền
  thời_hạn: string | null;
  thời_hạn_bằng_chữ: string | null;
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
