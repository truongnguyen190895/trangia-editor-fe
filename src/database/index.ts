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