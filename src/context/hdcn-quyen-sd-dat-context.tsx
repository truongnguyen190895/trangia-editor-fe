import type { AgreementEntity } from "@/models/agreement-entity";
import { createContext, useContext, useState } from "react";

interface HdcnQuyenSdDatContextType {
  partyAEntities: AgreementEntity[];
  partyBEntities: AgreementEntity[];
  editEntityIndex: number | null;
  setEditEntityIndex: (index: number | null) => void;
  addPartyAEntity: (entity: AgreementEntity, index?: number) => void;
  addPartyBEntity: (entity: AgreementEntity, index?: number) => void;
  deletePartyAEntity: (arrayIndex: number) => void;
  deletePartyBEntity: (arrayIndex: number) => void;
}

export const HdcnQuyenSdDatContext = createContext<HdcnQuyenSdDatContextType>({
  partyAEntities: [],
  partyBEntities: [],
  editEntityIndex: null,
  setEditEntityIndex: () => {},
  addPartyAEntity: () => {},
  addPartyBEntity: () => {},
  deletePartyAEntity: () => {},
  deletePartyBEntity: () => {},
});

export const useHdcnQuyenSdDatContext = () => useContext(HdcnQuyenSdDatContext);

export const HdcnQuyenSdDatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [partyAEntities, setPartyAEntities] = useState<AgreementEntity[]>([]);
  const [partyBEntities, setPartyBEntities] = useState<AgreementEntity[]>([]);
  const [editEntityIndex, setEditEntityIndex] = useState<number | null>(null);

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

  return (
    <HdcnQuyenSdDatContext.Provider
      value={{
        partyAEntities,
        partyBEntities,
        editEntityIndex,
        setEditEntityIndex,
        addPartyAEntity,
        addPartyBEntity,
        deletePartyAEntity,
        deletePartyBEntity,
      }}
    >
      {children}
    </HdcnQuyenSdDatContext.Provider>
  );
};
