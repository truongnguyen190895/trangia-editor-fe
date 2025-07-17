export interface ThongTinThuaDat {
  "số_thửa_đất": string;
  "số_tờ_bản_đồ": string;
  "địa_chỉ_cũ": string;
  "địa_chỉ_mới": string;
  "loại_giấy_chứng_nhận": string;
  "số_giấy_chứng_nhận": string;
  "số_vào_sổ_cấp_giấy_chứng_nhận": string;
  "nơi_cấp_giấy_chứng_nhận": string;
  "ngày_cấp_giấy_chứng_nhận": string;
  "diện_tích": string;
  "diện_tích_bằng_chữ": string;
  "hình_thức_sử_dụng": string;
  "nguồn_gốc_sử_dụng": string;
  "giá_tiền": string;
  "giá_tiền_bằng_chữ": string;
  "ghi_chú": string;
  "mục_đích_và_thời_hạn_sử_dụng": {
    "phân_loại": string;
    "diện_tích": string;
    "thời_hạn_sử_dụng": string;
  }[];
}