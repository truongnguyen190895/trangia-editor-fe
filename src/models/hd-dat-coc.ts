import type { Party } from "./party";

export interface HdDatCocPayload {
  bên_A: Party;
  bên_B: Party;
  ngày: string;
  ngày_bằng_chữ: string;
  số_bản_gốc: string;
  số_bản_gốc_bằng_chữ: string;
  số_bản_công_chứng: string;
  số_bản_công_chứng_bằng_chữ: string;
  ký_bên_ngoài: boolean;
  đặt_cọc_đất: DatCocDatHoacNhaDat | null;
  đặt_cọc_nhà_đất: DatCocDatHoacNhaDat | null;
  đặt_cọc_căn_hộ: DatCocCanHo | null;
  đặt_cọc_tài_sản: DatCocTaiSan | null;
  số_tiền_cọc: string;
  số_tiền_cọc_bằng_chữ: string;
  thời_hạn_cọc: string;
  thời_hạn_cọc_bằng_chữ: string;
  tiền_phạt_cọc: string;
  tiền_phạt_cọc_bằng_chữ: string;
  công_chứng_viên: string;
}

export interface GiayChungNhan {
  loại_gcn: string;
  số_gcn: string;
  số_vào_sổ_cấp_gcn: string;
  nơi_cấp_gcn: string;
  ngày_cấp_gcn: string;
}

export interface DatCocDatHoacNhaDat extends GiayChungNhan {
  số_thửa_đất: string;
  số_tờ_bản_đồ: string;
  địa_chỉ_hiển_thị: string;
}

export interface DatCocCanHo extends GiayChungNhan {
  số_căn_hộ: string;
  tên_toà_nhà: string;
  địa_chỉ_hiển_thị: string;
}

export interface DatCocTaiSan extends GiayChungNhan {
  tên_tài_sản: string;
  địa_chỉ_hiển_thị: string;
}
