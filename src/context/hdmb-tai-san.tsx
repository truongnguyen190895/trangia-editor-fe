import type {
    AgreementParty,
    SingleAgreementParty,
    Couple,
  } from "@/models/agreement-entity";
  import type { ThongTinTaiSan, ThongTinThuaDat } from "@/models/hdcn-dat-va-tsglvd";
  import { createContext, useContext, useState } from "react";
  
  interface HDMBTaiSanContextType {
    partyA: AgreementParty;
    partyB: AgreementParty;
    agreementObject: ThongTinThuaDat | null;
    taiSan: ThongTinTaiSan | null;
    singlePartyAEntityIndex: number | null;
    singlePartyBEntityIndex: number | null;
    couplePartyAEntityIndex: number | null;
    couplePartyBEntityIndex: number | null;
    //   Single section
    addSinglePartyAEntity: (entity: SingleAgreementParty, index?: number) => void;
    addSinglePartyBEntity: (entity: SingleAgreementParty, index?: number) => void;
    addTaiSan: (taiSan: ThongTinTaiSan) => void;
    deleteTaiSan: () => void;
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
    addAgreementObject: (object: ThongTinThuaDat) => void;
    deleteAgreementObject: () => void;
  }
  
  export const HDMBTaiSanContext = createContext<HDMBTaiSanContextType>({
    agreementObject: null,
    taiSan: null,
    singlePartyAEntityIndex: null,
    singlePartyBEntityIndex: null,
    couplePartyAEntityIndex: null,
    couplePartyBEntityIndex: null,
    partyA: {
      cá_nhân: [],
      vợ_chồng: [],
    },
    partyB: {
      cá_nhân: [],
      vợ_chồng: [],
    },
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
    addTaiSan: () => {},
    deleteTaiSan: () => {},
    //delete
    deleteAgreementObject: () => {},
  });
  
  export const useHDMBTaiSanContext = () => useContext(HDMBTaiSanContext);
  
  export const HDMBTaiSanProvider = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    const [partyA, setPartyA] = useState<AgreementParty>({
      cá_nhân: [],
      vợ_chồng: [],
    });
    const [partyB, setPartyB] = useState<AgreementParty>({
      cá_nhân: [],
      vợ_chồng: [],
    });
  
    const [agreementObject, setAgreementObject] =
      useState<ThongTinThuaDat | null>(null);
    const [taiSan, setTaiSan] = useState<ThongTinTaiSan | null>(null);
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
  
    const addAgreementObject = (object: ThongTinThuaDat) => {
      setAgreementObject(object);
    };
  
    const deleteAgreementObject = () => {
      setAgreementObject(null);
    };
  
    const addSinglePartyAEntity = (
      entity: SingleAgreementParty,
      index?: number
    ) => {
      if (index !== undefined) {
        setPartyA({
          ...partyA,
          cá_nhân: [
            ...partyA["cá_nhân"].slice(0, index),
            entity,
            ...partyA["cá_nhân"].slice(index + 1),
          ],
        });
      } else {
        setPartyA({
          ...partyA,
          cá_nhân: [...partyA["cá_nhân"], entity],
        });
      }
    };
  
    const addCouplePartyAEntity = (entity: Couple, index?: number) => {
      if (index !== undefined) {
        setPartyA({
          ...partyA,
          vợ_chồng: [...partyA["vợ_chồng"], entity],
        });
      } else {
        setPartyA({
          ...partyA,
          vợ_chồng: [...partyA["vợ_chồng"], entity],
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
          cá_nhân: [...partyB["cá_nhân"], entity],
        });
      } else {
        setPartyB({
          ...partyB,
          cá_nhân: [...partyB["cá_nhân"], entity],
        });
      }
    };
  
    const addCouplePartyBEntity = (entity: Couple, index?: number) => {
      if (index !== undefined) {
        setPartyB({
          ...partyB,
          vợ_chồng: [...partyB["vợ_chồng"], entity],
        });
      } else {
        setPartyB({
          ...partyB,
          vợ_chồng: [...partyB["vợ_chồng"], entity],
        });
      }
    };
  
    const deleteSinglePartyAEntity = (arrayIndex: number) => {
      setPartyA({
        ...partyA,
        cá_nhân: partyA["cá_nhân"].filter((_e, index) => index !== arrayIndex),
      });
    };
  
    const deleteSinglePartyBEntity = (arrayIndex: number) => {
      setPartyB({
        ...partyB,
        cá_nhân: partyB["cá_nhân"].filter((_e, index) => index !== arrayIndex),
      });
    };
  
    const editSinglePartyAEntity = (
      entity: SingleAgreementParty,
      arrayIndex: number
    ) => {
      setPartyA({
        ...partyA,
        cá_nhân: partyA["cá_nhân"].map((e, index) =>
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
        cá_nhân: partyB["cá_nhân"].map((e, index) =>
          index === arrayIndex ? entity : e
        ),
      });
    };
  
    const editCouplePartyAEntity = (entity: Couple, arrayIndex: number) => {
      setPartyA({
        ...partyA,
        vợ_chồng: partyA["vợ_chồng"].map((e, index) =>
          index === arrayIndex ? entity : e
        ),
      });
    };
  
    const editCouplePartyBEntity = (entity: Couple, arrayIndex: number) => {
      setPartyB({
        ...partyB,
        vợ_chồng: partyB["vợ_chồng"].map((e, index) =>
          index === arrayIndex ? entity : e
        ),
      });
    };
  
    const deleteCouplePartyAEntity = (arrayIndex: number) => {
      setPartyA({
        ...partyA,
        vợ_chồng: partyA["vợ_chồng"].filter((_e, index) => index !== arrayIndex),
      });
    };
  
    const deleteCouplePartyBEntity = (arrayIndex: number) => {
      setPartyB({
        ...partyB,
        vợ_chồng: partyB["vợ_chồng"].filter((_e, index) => index !== arrayIndex),
      });
    };
  
    const addTaiSan = (taiSan: ThongTinTaiSan) => {
      setTaiSan(taiSan);
    };
  
    const deleteTaiSan = () => {
      setTaiSan(null);
    };
  
    return (
      <HDMBTaiSanContext.Provider
        value={{
          agreementObject,
          taiSan,
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
          addAgreementObject,
          deleteAgreementObject,
          addTaiSan,
          deleteTaiSan,
        }}
      >
        {children}
      </HDMBTaiSanContext.Provider>
    );
  };
  