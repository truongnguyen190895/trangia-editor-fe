export interface ThongTinThuaDat {
  số_thửa_đất: string;
  số_tờ_bản_đồ: string;
  địa_chỉ_cũ: string | null;
  địa_chỉ_mới: string;
  loại_giấy_chứng_nhận: string;
  số_giấy_chứng_nhận: string;
  số_vào_sổ_cấp_giấy_chứng_nhận: string;
  nơi_cấp_giấy_chứng_nhận: string;
  ngày_cấp_giấy_chứng_nhận: string;
  diện_tích: string;
  diện_tích_bằng_chữ: string;
  diện_tích_phi_nông_nghiệp: string;
  một_phần_diện_tích?: string;
  một_phần_diện_tích_bằng_chữ?: string;
  hình_thức_sử_dụng: string;
  nguồn_gốc_sử_dụng: string | null;
  giá_tiền: string;
  giá_tiền_bằng_chữ: string;
  ghi_chú: string;
  mục_đích_và_thời_hạn_sử_dụng: {
    phân_loại: string;
    diện_tích: string;
    thời_hạn_sử_dụng: string;
  }[];
  mục_đích_và_thời_hạn_sử_dụng_một_phần: {
    phân_loại: string;
    diện_tích: string;
    thời_hạn_sử_dụng: string;
  }[];
  // liên quan đến uỷ quyền
  thời_hạn: string | null;
  thời_hạn_bằng_chữ: string | null;
  // Chi tiết riêng cho mẫu "tặng cho một phần đất có công văn" (ĐIỀU 1, mục 1).
  // Các trường này điền tay theo từng hợp đồng, gate bằng cờ isCoCongVan.
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
}
