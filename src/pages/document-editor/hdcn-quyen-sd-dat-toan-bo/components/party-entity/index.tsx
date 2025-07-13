import {
  Box,
  Typography,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
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
    partyA,
    partyB,
    deletePartyAEntity,
    deletePartyBEntity,
    setEditEntityIndex,
  } = useHdcnQuyenSdDatContext();
  const [open, setOpen] = useState(false);
  const partyEntities = side === "partyA" ? partyA : partyB;
  const individualParty = partyEntities["cá nhân"];
  const coupleParty = partyEntities["vợ chồng"];

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleDeleteEntity = (arrayIndex: number) => {
    side === "partyA"
      ? deletePartyAEntity(arrayIndex)
      : deletePartyBEntity(arrayIndex);
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
      <Box
        paddingX="10px"
        paddingY="20px"
        display="flex"
        gap="1rem"
        flexDirection="column"
      >
        <Box>
          <Typography variant="h6">Chủ thể là cá nhân</Typography>
          {individualParty.length > 0 ? (
            <Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1">Giới tính</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Tên</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Ngày sinh</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Loại giấy tờ</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Số giấy tờ</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Ngày cấp</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Nơi cấp</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        Địa chỉ thường trú cũ
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        Địa chỉ thường trú mới
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {individualParty.map((entity) => (
                    <TableRow key={entity.tên}>
                      <TableCell>{entity["giới tính"]}</TableCell>
                      <TableCell>{entity.tên}</TableCell>
                      <TableCell>{entity["ngày sinh"]}</TableCell>
                      <TableCell>{entity["loại giấy tờ"]}</TableCell>
                      <TableCell>{entity["số giấy tờ"]}</TableCell>
                      <TableCell>{entity["ngày cấp"]}</TableCell>
                      <TableCell>{entity["nơi cấp"]}</TableCell>
                      <TableCell>{entity["địa chỉ thường trú cũ"]}</TableCell>
                      <TableCell>{entity["địa chỉ thường trú mới"]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box
                display="flex"
                alignItems="center"
                marginTop="10px"

              >
                <AddCircleRoundedIcon
                  sx={{ fontSize: "4rem", color: "#3D90D7", cursor: "pointer", 
                    '&:active': {
                        scale: 0.9,
                        transition: 'scale 0.1s ease'
                    }
                   }}
                />
              </Box>
            </Box>
          ) : (
            <Box display="flex" marginTop="10px" height="50px">
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<AddIcon />}
                sx={{ flex: 1 }}
              >
                <Typography variant="body1">Thêm thông tin cá nhân</Typography>
              </Button>
            </Box>
          )}
        </Box>
        <Divider />
        <Box>
          <Typography variant="h6">Chủ thể là vợ chồng</Typography>
          {coupleParty.length > 0 ? (
            <Box>
              <Typography variant="body1">{coupleParty[0].tên}</Typography>
            </Box>
          ) : (
            <Box display="flex" marginTop="10px" height="50px">
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<AddIcon />}
                sx={{ flex: 1 }}
              >
                <Typography variant="body1">Thêm thông tin vợ chồng</Typography>
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
