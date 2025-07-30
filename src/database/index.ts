interface DanhMucVanBan {
  id: number;
  name: string;
  type: string;
  description: string;
}

interface DanhMucCon {
  id: number;
  fk_danh_muc_van_ban_id: number;
  name: string;
  type: string;
  description: string;
}

interface CacLoaiVanBan {
  id: number;
  fk_danh_muc_con_id: number;
  name: string;
  type: string;
  description: string;
}

export const DANH_MUC_VAN_BAN: DanhMucVanBan[] = [
  {
    id: 1,
    name: "Hợp Đồng, Giao Dịch",
    type: "hợp_đồng",
    description: "Hợp đồng",
  },
  {
    id: 2,
    name: "Đơn",
    type: "đơn",
    description: "Các loại đơn",
  },
];

export const DANH_MUC_CON: DanhMucCon[] = [
  {
    id: 1,
    fk_danh_muc_van_ban_id: 1,
    name: "Nhóm chuyển nhượng, mua bán",
    type: "hợp_đồng_mua_ban",
    description: "Hợp đồng mua bán",
  },
  {
    id: 2,
    fk_danh_muc_van_ban_id: 1,
    name: "Nhóm Uỷ Quyền",
    type: "uy_quyen",
    description: "Nhóm uỷ quyền",
  },
];

export const CAC_LOAI_VAN_BAN: CacLoaiVanBan[] = [
  {
    id: 1,
    fk_danh_muc_con_id: 1,
    name: "HĐCN Quyền sử dụng đất toàn bộ.docx",
    type: "hợp_đồng_mua_ban",
    description: "Hợp đồng mua bán",
  },
];

export const templates = [
  {
    id: 1,
    name: "HĐCN Quyền sử dụng đất toàn bộ.docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdcn-quyen-su-dung-dat-toan-bo",
  },
  {
    id: 2,
    name: "HĐMB Căn hộ toàn bộ.docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdmb-can-ho-toan-bo",
  },
  {
    id: 3,
    name: "HĐMB nhà đất toàn bộ.docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdmb-nha-dat-toan-bo",
  },
  {
    id: 4,
    name: "HĐCN Quyền sử dụng đất nông nghiệp toàn bộ.docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdcn-quyen-su-dung-dat-nong-nghiep-toan-bo",
  },
  {
    id: 5,
    name: "HĐCN đất và tài sản gắn liền với đất toàn bộ.docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdcn-dat-va-tai-san-gan-lien-voi-dat-toan-bo",
  },
  {
    id: 6,
    name: "HĐ tặng cho căn hộ toàn bộ.docx",
    type: "agreement",
    subCategory: "tang-cho",
    path: "hd-tang-cho-can-ho-toan-bo",
  },
  {
    id: 7,
    name: "HĐ tặng cho đất nông nghiệp toàn bộ.docx",
    type: "agreement",
    subCategory: "tang-cho",
    path: "hd-tang-cho-dat-nong-nghiep-toan-bo",
  },
  {
    id: 8,
    name: "HĐ tặng cho đất toàn bộ.docx",
    type: "agreement",
    subCategory: "tang-cho",
    path: "hd-tang-cho-dat-toan-bo",
  },
  {
    id: 9,
    name: "HĐ tặng cho nhà đất toàn bộ.docx",
    type: "agreement",
    subCategory: "tang-cho",
    path: "hd-tang-cho-nha-dat-toan-bo",
  },
  {
    id: 10,
    name: "Uỷ quyền toàn bộ quyền sử dụng đất.docx",
    type: "agreement",
    subCategory: "uy-quyen",
    path: "uy-quyen-toan-bo-quyen-su-dung-dat",
  },
  {
    id: 11,
    name: "Uỷ quyền toàn bộ nhà + đất.docx",
    type: "agreement",
    subCategory: "uy-quyen",
    path: "uy-quyen-toan-bo-nha-dat",
  },
  {
    id: 12,
    name: "Uỷ quyền căn hộ.docx",
    type: "agreement",
    subCategory: "uy-quyen",
    path: "uy-quyen-toan-bo-can-ho",
  },
  {
    id: 13,
    name: "HĐMB xe ôtô.docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdmb-xe-oto",
  },
  {
    id: 14,
    name: "HĐMB xe máy.docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdmb-xe-may",
  },
];
