import type {
  AgreementParty,
  SingleAgreementParty,
  Couple,
} from "@/models/agreement-entity";
import type { ThongTinThuaDat } from "@/models/agreement-object";
import { createContext, useContext, useState } from "react";

interface HdcnQuyenSdDatContextType {
  partyA: AgreementParty;
  partyB: AgreementParty;
  agreementObjects: ThongTinThuaDat[];
  editObjectIndex: number | null;
  singlePartyAEntityIndex: number | null;
  singlePartyBEntityIndex: number | null;
  couplePartyAEntityIndex: number | null;
  couplePartyBEntityIndex: number | null;
  //   Single section
  addSinglePartyAEntity: (entity: SingleAgreementParty, index?: number) => void;
  addSinglePartyBEntity: (entity: SingleAgreementParty, index?: number) => void;
  deleteSinglePartyAEntity: (arrayIndex: number) => void;
  deleteSinglePartyBEntity: (arrayIndex: number) => void;
  deleteCouplePartyAEntity: (arrayIndex: number) => void;
  deleteCouplePartyBEntity: (arrayIndex: number) => void;
  setSinglePartyAEntityIndex: (arrayIndex: number | null) => void;
  setSinglePartyBEntityIndex: (arrayIndex: number | null) => void;
  setCouplePartyAEntityIndex: (arrayIndex: number | null) => void;
  setCouplePartyBEntityIndex: (arrayIndex: number | null) => void;
  editSinglePartyAEntity: (
    entity: SingleAgreementParty,
    arrayIndex: number
  ) => void;
  editSinglePartyBEntity: (
    entity: SingleAgreementParty,
    arrayIndex: number
  ) => void;
  editCouplePartyAEntity: (entity: Couple, arrayIndex: number) => void;
  editCouplePartyBEntity: (entity: Couple, arrayIndex: number) => void;
  //   Couple section
  addCouplePartyAEntity: (entity: Couple, index?: number) => void;
  addCouplePartyBEntity: (entity: Couple, index?: number) => void;
  //   Common section
  setEditObjectIndex: (index: number | null) => void;
  addAgreementObject: (object: ThongTinThuaDat, index?: number) => void;
  deleteAgreementObject: (arrayIndex: number) => void;
}

export const HdcnQuyenSdDatContext = createContext<HdcnQuyenSdDatContextType>({
  agreementObjects: [],
  editObjectIndex: null,
  singlePartyAEntityIndex: null,
  singlePartyBEntityIndex: null,
  couplePartyAEntityIndex: null,
  couplePartyBEntityIndex: null,
  partyA: {
    "cá nhân": [],
    "vợ chồng": [],
  },
  partyB: {
    "cá nhân": [],
    "vợ chồng": [],
  },
  setEditObjectIndex: () => {},
  addSinglePartyAEntity: () => {},
  addCouplePartyAEntity: () => {},
  addSinglePartyBEntity: () => {},
  addCouplePartyBEntity: () => {},
  deleteSinglePartyAEntity: () => {},
  deleteSinglePartyBEntity: () => {},
  editSinglePartyAEntity: () => {},
  deleteCouplePartyAEntity: () => {},
  deleteCouplePartyBEntity: () => {},
  setSinglePartyAEntityIndex: () => {},
  setSinglePartyBEntityIndex: () => {},
  setCouplePartyAEntityIndex: () => {},
  setCouplePartyBEntityIndex: () => {},
  editSinglePartyBEntity: () => {},
  editCouplePartyAEntity: () => {},
  editCouplePartyBEntity: () => {},
  addAgreementObject: () => {},
  //delete
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
        tên: "Đỗ Viết Chiến",
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
      dien_tich: "123",
      hinh_thuc_su_dung: "Sử dụng đất",
      muc_dich_su_dung: "T",
      thoi_han_su_dung: "Lâu dài",
      nguon_goc_su_dung: "Lấy đất từ UBND huyện Chương Mỹ",
      ghi_chu:
        "Đổi lại giấy chứng nhận mới khi đã có bản đồ Địa chính có toạ độ",
    },
  ]);

  console.log("agreementObjects from context", agreementObjects);

  const [editObjectIndex, setEditObjectIndex] = useState<number | null>(null);
  const [singlePartyAEntityIndex, setSinglePartyAEntityIndex] = useState<
    number | null
  >(null);
  const [singlePartyBEntityIndex, setSinglePartyBEntityIndex] = useState<
    number | null
  >(null);
  const [couplePartyAEntityIndex, setCouplePartyAEntityIndex] = useState<
    number | null
  >(null);
  const [couplePartyBEntityIndex, setCouplePartyBEntityIndex] = useState<
    number | null
  >(null);

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

  const deleteAgreementObject = (arrayIndex: number) => {
    setAgreementObjects(
      agreementObjects.filter((_e, index) => index !== arrayIndex)
    );
  };

  const addSinglePartyAEntity = (
    entity: SingleAgreementParty,
    index?: number
  ) => {
    if (index !== undefined) {
      setPartyA({
        ...partyA,
        "cá nhân": [
          ...partyA["cá nhân"].slice(0, index),
          entity,
          ...partyA["cá nhân"].slice(index + 1),
        ],
      });
    } else {
      setPartyA({
        ...partyA,
        "cá nhân": [...partyA["cá nhân"], entity],
      });
    }
  };

  const addCouplePartyAEntity = (entity: Couple, index?: number) => {
    if (index !== undefined) {
      setPartyA({
        ...partyA,
        "vợ chồng": [...partyA["vợ chồng"], entity],
      });
    } else {
      setPartyA({
        ...partyA,
        "vợ chồng": [...partyA["vợ chồng"], entity],
      });
    }
  };

  const addSinglePartyBEntity = (
    entity: SingleAgreementParty,
    index?: number
  ) => {
    if (index !== undefined) {
      setPartyB({
        ...partyB,
        "cá nhân": [...partyB["cá nhân"], entity],
      });
    } else {
      setPartyB({
        ...partyB,
        "cá nhân": [...partyB["cá nhân"], entity],
      });
    }
  };

  const addCouplePartyBEntity = (entity: Couple, index?: number) => {
    if (index !== undefined) {
      setPartyB({
        ...partyB,
        "vợ chồng": [...partyB["vợ chồng"], entity],
      });
    } else {
      setPartyB({
        ...partyB,
        "vợ chồng": [...partyB["vợ chồng"], entity],
      });
    }
  };

  const deleteSinglePartyAEntity = (arrayIndex: number) => {
    setPartyA({
      ...partyA,
      "cá nhân": partyA["cá nhân"].filter((_e, index) => index !== arrayIndex),
    });
  };

  const deleteSinglePartyBEntity = (arrayIndex: number) => {
    setPartyB({
      ...partyB,
      "cá nhân": partyB["cá nhân"].filter((_e, index) => index !== arrayIndex),
    });
  };

  const editSinglePartyAEntity = (
    entity: SingleAgreementParty,
    arrayIndex: number
  ) => {
    setPartyA({
      ...partyA,
      "cá nhân": partyA["cá nhân"].map((e, index) =>
        index === arrayIndex ? entity : e
      ),
    });
  };

  const editSinglePartyBEntity = (
    entity: SingleAgreementParty,
    arrayIndex: number
  ) => {
    setPartyB({
      ...partyB,
      "cá nhân": partyB["cá nhân"].map((e, index) =>
        index === arrayIndex ? entity : e
      ),
    });
  };

  const editCouplePartyAEntity = (entity: Couple, arrayIndex: number) => {
    setPartyA({
      ...partyA,
      "vợ chồng": partyA["vợ chồng"].map((e, index) =>
        index === arrayIndex ? entity : e
      ),
    });
  };

  const editCouplePartyBEntity = (entity: Couple, arrayIndex: number) => {
    setPartyB({
      ...partyB,
      "vợ chồng": partyB["vợ chồng"].map((e, index) =>
        index === arrayIndex ? entity : e
      ),
    });
  };

  const deleteCouplePartyAEntity = (arrayIndex: number) => {
    setPartyA({
      ...partyA,
      "vợ chồng": partyA["vợ chồng"].filter(
        (_e, index) => index !== arrayIndex
      ),
    });
  };

  const deleteCouplePartyBEntity = (arrayIndex: number) => {
    setPartyB({
      ...partyB,
      "vợ chồng": partyB["vợ chồng"].filter(
        (_e, index) => index !== arrayIndex
      ),
    });
  };

  return (
    <HdcnQuyenSdDatContext.Provider
      value={{
        agreementObjects,
        editObjectIndex,
        singlePartyAEntityIndex,
        singlePartyBEntityIndex,
        couplePartyAEntityIndex,
        couplePartyBEntityIndex,
        partyA,
        partyB,
        addSinglePartyAEntity,
        addCouplePartyAEntity,
        addSinglePartyBEntity,
        addCouplePartyBEntity,
        deleteSinglePartyAEntity,
        deleteSinglePartyBEntity,
        deleteCouplePartyAEntity,
        deleteCouplePartyBEntity,
        editSinglePartyAEntity,
        editSinglePartyBEntity,
        editCouplePartyAEntity,
        editCouplePartyBEntity,
        setSinglePartyAEntityIndex,
        setSinglePartyBEntityIndex,
        setCouplePartyAEntityIndex,
        setCouplePartyBEntityIndex,
        setEditObjectIndex,
        addAgreementObject,
        deleteAgreementObject,
      }}
    >
      {children}
    </HdcnQuyenSdDatContext.Provider>
  );
};
