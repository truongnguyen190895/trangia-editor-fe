import { v4 as uuidv4 } from "uuid";
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

export const templates = [
  {
    id: uuidv4(),
    name: "HĐCN Quyền sử dụng đất toàn bộ.docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdcn-quyen-su-dung-dat-toan-bo",
    templateId: 5,
  },
  {
    id: uuidv4(),
    name: "HĐCN một phần đất và TSGLVD (để đồng sử dụng).docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdcn-mot-phan-dat-va-tsglvd-de-dong-su-dung",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "HĐCN một phần đất và TSGLVD (để sử dụng toàn bộ).docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdcn-mot-phan-dat-va-tsglvd-de-su-dung-toan-bo",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "HĐCN Quyền sử dụng đất nông nghiệp toàn bộ.docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdcn-quyen-su-dung-dat-nong-nghiep-toan-bo",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "HĐCN đất và tài sản gắn liền với đất toàn bộ.docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdcn-dat-va-tai-san-gan-lien-voi-dat-toan-bo",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "HĐMB căn hộ toàn bộ.docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdmb-can-ho-toan-bo",
    templateId: 1,
  },
  {
    id: uuidv4(),
    name: "HĐMB căn hộ một phần (để sở hữu toàn bộ).docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdmb-can-ho-mot-phan-de-so-huu-toan-bo",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "HĐMB nhà đất toàn bộ.docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdmb-nha-dat-toan-bo",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "HĐ tặng cho căn hộ toàn bộ.docx",
    type: "agreement",
    subCategory: "tang-cho",
    path: "hd-tang-cho-can-ho-toan-bo",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "HĐ tặng cho đất nông nghiệp toàn bộ.docx",
    type: "agreement",
    subCategory: "tang-cho",
    path: "hd-tang-cho-dat-nong-nghiep-toan-bo",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "HĐ tặng cho đất toàn bộ.docx",
    type: "agreement",
    subCategory: "tang-cho",
    path: "hd-tang-cho-dat-toan-bo",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "HĐ tặng cho nhà đất toàn bộ.docx",
    type: "agreement",
    subCategory: "tang-cho",
    path: "hd-tang-cho-nha-dat-toan-bo",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "Uỷ quyền toàn bộ quyền sử dụng đất.docx",
    type: "agreement",
    subCategory: "uy-quyen",
    path: "uy-quyen-toan-bo-quyen-su-dung-dat",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "Uỷ quyền toàn bộ nhà + đất.docx",
    type: "agreement",
    subCategory: "uy-quyen",
    path: "uy-quyen-toan-bo-nha-dat",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "Uỷ quyền căn hộ.docx",
    type: "agreement",
    subCategory: "uy-quyen",
    path: "uy-quyen-toan-bo-can-ho",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "HĐMB xe ôtô.docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdmb-xe-oto",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "HĐMB xe máy.docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdmb-xe-may",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "HĐMB xe ôtô + Biển số xe.docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdmb-xe-oto-bien-so-xe",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "Uỷ quyền xe ôtô.docx",
    type: "agreement",
    subCategory: "uy-quyen",
    path: "uy-quyen-xe-oto",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "HĐMB tài sản.docx",
    type: "agreement",
    subCategory: "chuyen-nhuong-mua-ban",
    path: "hdmb-tai-san",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "VB huỷ.docx",
    type: "agreement",
    subCategory: "huy-sua-doi-bo-sung-cham-dut",
    path: "vb-huy",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "VB chấm dứt hợp đồng.docx",
    type: "agreement",
    subCategory: "huy-sua-doi-bo-sung-cham-dut",
    path: "vb-cham-dut-hd",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "VB chấm dứt hợp đồng uỷ quyền.docx",
    type: "agreement",
    subCategory: "huy-sua-doi-bo-sung-cham-dut",
    path: "vb-cham-dut-hq-uy-quyen",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "HĐ đặt cọc.docx",
    type: "agreement",
    subCategory: "thue-muon-dat-coc",
    path: "hd-dat-coc",
    templateId: 0,
  },
  {
    id: uuidv4(),
    name: "HĐ đặt cọc chưa xoá chấp.docx",
    type: "agreement",
    subCategory: "thue-muon-dat-coc",
    path: "hd-dat-coc-chua-xoa-chap",
    templateId: 0,
  },
];
