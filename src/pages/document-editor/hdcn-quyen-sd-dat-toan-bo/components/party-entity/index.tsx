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
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { AddPartyDialog } from "@/pages/document-editor/hdcn-quyen-sd-dat-toan-bo/dialogs/add-party-dialog";
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";

interface PartyEntityProps {
  title: string;
  side: "partyA" | "partyB";
}

export const PartyEntity = ({ title, side }: PartyEntityProps) => {
  const {
    partyAEntities,
    partyBEntities,
    deletePartyAEntity,
    deletePartyBEntity,
    setEditEntityIndex,
  } = useHdcnQuyenSdDatContext();
  const [open, setOpen] = useState(false);
  const partyEntities = side === "partyA" ? partyAEntities : partyBEntities;

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleDeleteEntity = (arrayIndex: number) => {
    side === "partyA" ? deletePartyAEntity(arrayIndex) : deletePartyBEntity(arrayIndex);
  };

  const handleEditEntity = (arrayIndex: number) => {
    setEditEntityIndex(arrayIndex);
    handleOpenDialog();
  };

  return (
    <Box border="1px solid #BCCCDC" borderRadius="5px">
      <Box
        height="80px"
        bgcolor="#3D90D7"
        paddingX="10px"
        display="flex"
        alignItems="center"
      >
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Box padding="10px">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Thêm
        </Button>
        {partyEntities.length > 0 && (
          <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ông/Bà</TableCell>
                  <TableCell>Họ và tên</TableCell>
                  <TableCell>Ngày sinh</TableCell>
                  <TableCell>Loại giấy tờ</TableCell>
                  <TableCell>Số giấy tờ</TableCell>
                  <TableCell>Ngày cấp</TableCell>
                  <TableCell>Nơi cấp</TableCell>
                  <TableCell>Địa chỉ thường trú</TableCell>
                  <TableCell>Xem/Sửa</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {partyEntities.map((entity, index) => (
                  <TableRow key={entity.documentNumber}>
                    <TableCell>{entity.gender}</TableCell>
                    <TableCell>{entity.name}</TableCell>
                    <TableCell>
                      {dayjs(entity.dateOfBirth).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>{entity.documentType}</TableCell>
                    <TableCell>{entity.documentNumber}</TableCell>
                    <TableCell>{entity.documentIssuedDate}</TableCell>
                    <TableCell>{entity.documentIssuedBy}</TableCell>
                    <TableCell>{entity.address}</TableCell>
                    <TableCell>
                      <EditIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleEditEntity(index)}
                      />
                      <DeleteIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleDeleteEntity(index)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      {open ? (
        <AddPartyDialog
          open={open}
          side={side}
          handleClose={handleClose}
        />
      ) : null}
    </Box>
  );
};
