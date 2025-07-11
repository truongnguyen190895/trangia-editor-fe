import { useState } from "react";
import { Box } from "@mui/material";
import type { AgreementEntity } from "@/models/agreement-entity";
import { AddPartyDialog } from "./dialogs/add-party-dialog";
import { PartyEntity } from "./components/party-entity";

export const FullLandTransfer = () => {
  const [partyAEntities, setPartyAEntities] = useState<AgreementEntity[]>([]);
  const [partyBEntities, setPartyBEntities] = useState<AgreementEntity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<AgreementEntity | null>(
    null
  );
  const [destination, setDestination] = useState<"partyA" | "partyB">("partyA");
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (values: AgreementEntity) => {
    // Add new entity to the list
    const newEntity: AgreementEntity = {
      gender: values.gender!,
      name: values.name!,
      dateOfBirth: values.dateOfBirth || "",
      documentType: values.documentType!,
      documentNumber: values.documentNumber!,
      documentIssuedDate: values.documentIssuedDate || "",
      documentIssuedBy: values.documentIssuedBy || "",
      address: values.address || "",
    };
    destination === "partyA"
      ? setPartyAEntities((prev) => [...prev, newEntity])
      : setPartyBEntities((prev) => [...prev, newEntity]);
    handleClose();
  };

  const handleEditEntity = (entity: AgreementEntity) => {
    setSelectedEntity(entity);
    handleOpen();
  };

  const handleDeleteEntity = (entity: AgreementEntity) => {
    setPartyAEntities((prev) => prev.filter((e) => e.name !== entity.name));
  };

  const handleOpenPartyA = () => {
    setDestination("partyA");
    handleOpen();
  };
  const handleOpenPartyB = () => {
    setDestination("partyB");
    handleOpen();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Box
      className="full-land-transfer"
      display="flex"
      gap="5rem"
      flexDirection="column"
    >
      <PartyEntity
        title="Bên chuyển nhượng"
        partyEntities={partyAEntities}
        handleOpen={handleOpenPartyA}
        handleEditEntity={handleEditEntity}
        handleDeleteEntity={handleDeleteEntity}
      />
      <PartyEntity
        title="Bên nhận chuyển nhượng"
        partyEntities={partyBEntities}
        handleOpen={handleOpenPartyB}
        handleEditEntity={handleEditEntity}
        handleDeleteEntity={handleDeleteEntity}
      />
      {open ? (
        <AddPartyDialog
          open={open}
          destination={destination}
          initialEntity={selectedEntity}
          handleClose={handleClose}
          onCreate={handleSubmit}
        />
      ) : null}
    </Box>
  );
};
