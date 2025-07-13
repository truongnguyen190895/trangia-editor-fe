import type {
  AgreementEntity,
  AgreementParty,
} from "@/models/agreement-entity";
import type { ThongTinThuaDat } from "@/models/agreement-object";
import { createContext, useContext, useState } from "react";

interface HdcnQuyenSdDatContextType {
  partyAEntities: AgreementEntity[];
  partyBEntities: AgreementEntity[];
  partyA: AgreementParty;
  partyB: AgreementParty;
  agreementObjects: ThongTinThuaDat[];
  editEntityIndex: number | null;
  editObjectIndex: number | null;
  setEditEntityIndex: (index: number | null) => void;
  setEditObjectIndex: (index: number | null) => void;
  addPartyAEntity: (entity: AgreementEntity, index?: number) => void;
  addPartyBEntity: (entity: AgreementEntity, index?: number) => void;
  addAgreementObject: (object: ThongTinThuaDat, index?: number) => void;
  deletePartyAEntity: (arrayIndex: number) => void;
  deletePartyBEntity: (arrayIndex: number) => void;
  deleteAgreementObject: (arrayIndex: number) => void;
}

export const HdcnQuyenSdDatContext = createContext<HdcnQuyenSdDatContextType>({
  partyAEntities: [],
  partyBEntities: [],
  agreementObjects: [],
  editEntityIndex: null,
  editObjectIndex: null,
  partyA: {
    "cá nhân": [],
    "vợ chồng": [],
  },
  partyB: {
    "cá nhân": [],
    "vợ chồng": [],
  },
  setEditEntityIndex: () => {},
  setEditObjectIndex: () => {},
  addPartyAEntity: () => {},
  addPartyBEntity: () => {},
  addAgreementObject: () => {},
  deletePartyAEntity: () => {},
  deletePartyBEntity: () => {},
  deleteAgreementObject: () => {},
});

export const useHdcnQuyenSdDatContext = () => useContext(HdcnQuyenSdDatContext);

export const HdcnQuyenSdDatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [partyA, setPartyA] = useState<AgreementParty>({
    "cá nhân": [
      {
        "giới tính": "Ông",
        "tên": "Đỗ Viết Chiến",
        "ngày sinh": "03/06/1976",
        "loại giấy tờ": "CCCD",
        "số giấy tờ": "0123456789",
        "ngày cấp": "01/01/2020",
        "nơi cấp": "Cục cảnh sát quản lý hành chính về trật tự xã hội",
        "địa chỉ thường trú cũ":
          "Thôn Lương Xá, xã Lam Điền, huyện Hoài Đức, thành phố Hà Nội",
        "địa chỉ thường trú mới": "xã Quản Bị, thành phố Hà Nội",
        "tình trạng hôn nhân": "Đã kết hôn với bà Nguyễn Thị Bé",
      },
    ],
    "vợ chồng": [],
  });
  const [partyB, setPartyB] = useState<AgreementParty>({
    "cá nhân": [],
    "vợ chồng": [],
  });
  const [partyAEntities, setPartyAEntities] = useState<AgreementEntity[]>([
    {
      "giới tính": "Ông",
      tên: "Đỗ Viết Chiến",
      "ngày sinh": "03/06/1976",
      "loại giấy tờ": "CCCD",
      "số giấy tờ": "0123456789",
      "ngày cấp": "01/01/2020",
      "nơi cấp": "Cục cảnh sát quản lý hành chính về trật tự xã hội",
      "địa chỉ thường trú cũ":
        "Thôn Lương Xá, xã Lam Điền, huyện Hoài Đức, thành phố Hà Nội",
      "địa chỉ thường trú mới": "xã Quản Bị, thành phố Hà Nội",
    },
  ]);
  const [partyBEntities, setPartyBEntities] = useState<AgreementEntity[]>([]);
  const [agreementObjects, setAgreementObjects] = useState<ThongTinThuaDat[]>([
    {
      so_thua_dat: "326",
      to_ban_do_so: "8",
      dia_chi:
        "Thôn Quyết Tiến, xã Tiên Phương, huyện Chương Mỹ, tỉnh Hà Tây (nay là Thôn Quyết Tiến, phường Chương Mỹ, thành phố Hà Nội)",
      loai_giay_to: "Giấy chứng nhận quyền sử dụng đất",
      so_giay_to: "U 425562",
      so_vao_so_cap_gcn: "00129 QSDĐ/456/QĐ-UB",
      noi_cap_giay_chung_nhan: "UBND huyện Chương Mỹ",
      ngay_cap_giay_chung_nhan: "12/06/2010",
      dien_tich: 123,
      hinh_thuc_su_dung: "Sử dụng đất",
      muc_dich_su_dung: "T",
      thoi_han_su_dung: "Lâu dài",
      nguon_goc_su_dung: "Lấy đất từ UBND huyện Chương Mỹ",
      ghi_chu:
        "Đổi lại giấy chứng nhận mới khi đã có bản đồ Địa chính có toạ độ",
    },
  ]);
  const [editEntityIndex, setEditEntityIndex] = useState<number | null>(null);
  const [editObjectIndex, setEditObjectIndex] = useState<number | null>(null);

  const addAgreementObject = (object: ThongTinThuaDat, index?: number) => {
    if (index !== undefined) {
      setAgreementObjects([
        ...agreementObjects.slice(0, index),
        object,
        ...agreementObjects.slice(index + 1),
      ]);
    } else {
      setAgreementObjects([...agreementObjects, object]);
    }
  };

  const addPartyAEntity = (entity: AgreementEntity, index?: number) => {
    if (index !== undefined) {
      setPartyAEntities([
        ...partyAEntities.slice(0, index),
        entity,
        ...partyAEntities.slice(index + 1),
      ]);
    } else {
      setPartyAEntities([...partyAEntities, entity]);
    }
  };

  const deletePartyAEntity = (arrayIndex: number) => {
    setPartyAEntities(
      partyAEntities.filter((_e, index) => index !== arrayIndex)
    );
  };

  const addPartyBEntity = (entity: AgreementEntity, index?: number) => {
    if (index !== undefined) {
      setPartyBEntities([
        ...partyBEntities.slice(0, index),
        entity,
        ...partyBEntities.slice(index + 1),
      ]);
    } else {
      setPartyBEntities([...partyBEntities, entity]);
    }
  };

  const deletePartyBEntity = (arrayIndex: number) => {
    setPartyBEntities(
      partyBEntities.filter((_e, index) => index !== arrayIndex)
    );
  };

  const deleteAgreementObject = (arrayIndex: number) => {
    setAgreementObjects(
      agreementObjects.filter((_e, index) => index !== arrayIndex)
    );
  };

  return (
    <HdcnQuyenSdDatContext.Provider
      value={{
        partyAEntities,
        partyBEntities,
        agreementObjects,
        editEntityIndex,
        editObjectIndex,
        partyA,
        partyB,
        setEditEntityIndex,
        setEditObjectIndex,
        addPartyAEntity,
        addPartyBEntity,
        deletePartyAEntity,
        addAgreementObject,
        deletePartyBEntity,
        deleteAgreementObject,
      }}
    >
      {children}
    </HdcnQuyenSdDatContext.Provider>
  );
};
