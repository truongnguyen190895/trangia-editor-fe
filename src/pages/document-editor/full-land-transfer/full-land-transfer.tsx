import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { AgreementEntity } from "@/models/agreement-entity";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AddPartyDialog } from "./dialogs/add-party-dialog";
import { PartyEntity } from "./components/party-entity";

export const FullLandTransfer = () => {
  const [partyAEntities, setPartyAEntities] = useState<AgreementEntity[]>([]);
  const [partyBEntities, setPartyBEntities] = useState<AgreementEntity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<AgreementEntity | null>(
    null
  );
  const [open, setOpen] = useState(false);
  

  const handleOpen = () => {
    setOpen(true);
  };

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
    setPartyAEntities((prev) => [...prev, newEntity]);
    handleClose();
  };

  const handleEditEntity = (entity: AgreementEntity) => {
    setSelectedEntity(entity);
    handleOpen();
  };

  const handleDeleteEntity = (entity: AgreementEntity) => {
    setPartyAEntities((prev) => prev.filter((e) => e.name !== entity.name));
  };

  return (
    <Box
      className="full-land-transfer"
      display="flex"
      gap="8rem"
      flexDirection="column"
    >
      <PartyEntity
        title="Bên chuyển nhượng"
        partyEntities={partyAEntities}
        handleOpen={handleOpen}
        handleEditEntity={handleEditEntity}
        handleDeleteEntity={handleDeleteEntity}
      />
      <PartyEntity
        title="Bên nhận chuyển nhượng"
        partyEntities={partyBEntities}
        handleOpen={handleOpen}
        handleEditEntity={handleEditEntity}
        handleDeleteEntity={handleDeleteEntity}
      />
      {open ? (
        <AddPartyDialog
          open={open}
          initialEntity={selectedEntity}
          handleClose={handleClose}
          onCreate={handleSubmit}
        />
      ) : null}
    </Box>
  );
};
