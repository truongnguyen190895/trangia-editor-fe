import type {
  AgreementParty,
  SingleAgreementParty,
  Couple,
} from "@/models/chu-the-hop-dong";
import { createContext, useContext, useState } from "react";

interface ThemChuTheContextType {
  partyA: AgreementParty;
  partyB: AgreementParty;
  singlePartyAEntityIndex: number | null;
  singlePartyBEntityIndex: number | null;
  couplePartyAEntityIndex: number | null;
  couplePartyBEntityIndex: number | null;
  //   Single section
  addSinglePartyAEntity: (entity: SingleAgreementParty) => void;
  addSinglePartyBEntity: (entity: SingleAgreementParty) => void;
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
  addCouplePartyAEntity: (entity: Couple) => void;
  addCouplePartyBEntity: (entity: Couple) => void;
}

export const ThemChuTheContext = createContext<ThemChuTheContextType>({
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
});

export const useThemChuTheContext = () => useContext(ThemChuTheContext);

export const ThemChuTheProvider = ({
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

  const addSinglePartyAEntity = (entity: SingleAgreementParty) => {
    setPartyA((prev) => ({
      ...prev,
      cá_nhân: [...prev["cá_nhân"], entity],
    }));
  };

  const addCouplePartyAEntity = (entity: Couple) => {
    setPartyA((prev) => ({
      ...prev,
      vợ_chồng: [...prev["vợ_chồng"], entity],
    }));
  };

  const addSinglePartyBEntity = (entity: SingleAgreementParty) => {
    setPartyB((prev) => ({
      ...prev,
      cá_nhân: [...prev["cá_nhân"], entity],
    }));
  };

  const addCouplePartyBEntity = (entity: Couple) => {
    setPartyB((prev) => ({
      ...prev,
      vợ_chồng: [...prev["vợ_chồng"], entity],
    }));
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

  return (
    <ThemChuTheContext.Provider
      value={{
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
      }}
    >
      {children}
    </ThemChuTheContext.Provider>
  );
};
