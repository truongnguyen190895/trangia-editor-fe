import {
  Box,
  Typography,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";
import { AddSingleDialog } from "@/pages/document-editor/hdcn-quyen-sd-dat-toan-bo/dialogs/add-single";
import { AddCoupleDialog } from "@/pages/document-editor/hdcn-quyen-sd-dat-toan-bo/dialogs/add-couple";
import dayjs from "dayjs";

interface PartyEntityProps {
  title: string;
  side: "partyA" | "partyB";
}

export const PartyEntity = ({ title, side }: PartyEntityProps) => {
  const {
    partyA,
    partyB,
    deleteSinglePartyAEntity,
    deleteSinglePartyBEntity,
    deleteCouplePartyAEntity,
    deleteCouplePartyBEntity,
    setSinglePartyAEntityIndex,
    setSinglePartyBEntityIndex,
    setCouplePartyAEntityIndex,
    setCouplePartyBEntityIndex,
  } = useHdcnQuyenSdDatContext();
  const [openSingleDialog, setOpenSingleDialog] = useState(false);
  const [openCoupleDialog, setOpenCoupleDialog] = useState(false);
  const partyEntities = side === "partyA" ? partyA : partyB;
  const individualParty = partyEntities["cá_nhân"];
  const coupleParty = partyEntities["vợ_chồng"];

  const handleDeleteSingleParty = (arrayIndex: number) => {
    if (side === "partyA") {
      deleteSinglePartyAEntity(arrayIndex);
    } else {
      deleteSinglePartyBEntity(arrayIndex);
    }
  };

  const handleDeleteCoupleParty = (arrayIndex: number) => {
    if (side === "partyA") {
      deleteCouplePartyAEntity(arrayIndex);
    } else {
      deleteCouplePartyBEntity(arrayIndex);
    }
  };

  const handleEditSingleParty = (arrayIndex: number) => {
    if (side === "partyA") {
      setSinglePartyAEntityIndex(arrayIndex);
    } else {
      setSinglePartyBEntityIndex(arrayIndex);
    }
    setOpenSingleDialog(true);
  };

  const handleEditCoupleParty = (arrayIndex: number) => {
    if (side === "partyA") {
      setCouplePartyAEntityIndex(arrayIndex);
    } else {
      setCouplePartyBEntityIndex(arrayIndex);
    }
    setOpenCoupleDialog(true);
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
                      <Typography variant="body1">Xem chi tiết</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Sửa</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Xóa</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {individualParty.map((entity, index) => (
                    <TableRow
                      key={entity["số_giấy_tờ"]}
                      sx={{
                        "& .icon-action": {
                          cursor: "pointer",
                          "&:active": {
                            scale: 0.9,
                            transition: "scale 0.1s ease",
                          },
                        },
                      }}
                    >
                      <TableCell>{entity["giới_tính"]}</TableCell>
                      <TableCell>{entity.tên}</TableCell>
                      <TableCell>
                        {dayjs(entity["ngày_sinh"]).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>{entity["loại_giấy_tờ"]}</TableCell>
                      <TableCell>{entity["số_giấy_tờ"]}</TableCell>
                      <TableCell>
                        <VisibilityIcon
                          className="icon-action"
                          color="info"
                          onClick={() => handleEditSingleParty(index)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditIcon
                          className="icon-action"
                          color="info"
                          onClick={() => handleEditSingleParty(index)}
                        />
                      </TableCell>
                      <TableCell>
                        <DeleteIcon
                          className="icon-action"
                          color="error"
                          onClick={() => handleDeleteSingleParty(index)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box display="flex" alignItems="center" marginTop="10px">
                <AddCircleRoundedIcon
                  sx={{
                    fontSize: "3rem",
                    color: "#3D90D7",
                    cursor: "pointer",
                    "&:active": {
                      scale: 0.9,
                      transition: "scale 0.1s ease",
                    },
                  }}
                  onClick={() => setOpenSingleDialog(true)}
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
                onClick={() => setOpenSingleDialog(true)}
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
                      <Typography variant="body1">Xem chi tiết</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Sửa</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Xóa</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {coupleParty.map((entity, index) => (
                    <>
                      <TableRow
                        key={entity.chồng["số_giấy_tờ"]}
                        sx={{
                          "& .icon-action": {
                            cursor: "pointer",
                            "&:active": {
                              scale: 0.9,
                              transition: "scale 0.1s ease",
                            },
                          },
                        }}
                      >
                        <TableCell>{entity.chồng["giới_tính"]}</TableCell>
                        <TableCell>{entity.chồng.tên}</TableCell>
                        <TableCell>
                          {dayjs(entity.chồng["ngày_sinh"]).format(
                            "DD/MM/YYYY"
                          )}
                        </TableCell>
                        <TableCell>{entity.chồng["loại_giấy_tờ"]}</TableCell>
                        <TableCell>{entity.chồng["số_giấy_tờ"]}</TableCell>
                        <TableCell>
                          <VisibilityIcon
                            className="icon-action"
                            color="info"
                            onClick={() => handleEditCoupleParty(index)}
                          />
                        </TableCell>
                        <TableCell>
                          <EditIcon
                            className="icon-action"
                            color="info"
                            onClick={() => handleEditCoupleParty(index)}
                          />
                        </TableCell>
                        <TableCell>
                          <DeleteIcon
                            className="icon-action"
                            color="error"
                            onClick={() => handleDeleteCoupleParty(index)}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        key={entity.vợ["số_giấy_tờ"]}
                        sx={{
                          "& .icon-action": {
                            cursor: "pointer",
                            "&:active": {
                              scale: 0.9,
                              transition: "scale 0.1s ease",
                            },
                          },
                        }}
                      >
                        <TableCell>{entity.vợ["giới_tính"]}</TableCell>
                        <TableCell>{entity.vợ.tên}</TableCell>
                        <TableCell>
                          {dayjs(entity.vợ["ngày_sinh"]).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell>{entity.vợ["loại_giấy_tờ"]}</TableCell>
                        <TableCell>{entity.vợ["số_giấy_tờ"]}</TableCell>
                        <TableCell>
                          <VisibilityIcon
                            className="icon-action"
                            color="info"
                            onClick={() => handleEditCoupleParty(index)}
                          />
                        </TableCell>
                        <TableCell>
                          <EditIcon
                            className="icon-action"
                            color="info"
                            onClick={() => handleEditCoupleParty(index)}
                          />
                        </TableCell>
                        <TableCell>
                          <DeleteIcon
                            className="icon-action"
                            color="error"
                            onClick={() => handleDeleteCoupleParty(index)}
                          />
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
              <Box display="flex" alignItems="center" marginTop="10px">
                <AddCircleRoundedIcon
                  sx={{
                    fontSize: "3rem",
                    color: "#3D90D7",
                    cursor: "pointer",
                    "&:active": {
                      scale: 0.9,
                      transition: "scale 0.1s ease",
                    },
                  }}
                  onClick={() => setOpenCoupleDialog(true)}
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
                onClick={() => setOpenCoupleDialog(true)}
              >
                <Typography variant="body1">Thêm thông tin vợ chồng</Typography>
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      {openSingleDialog && (
        <AddSingleDialog
          open={openSingleDialog}
          side={side}
          onClose={() => setOpenSingleDialog(false)}
        />
      )}
      {openCoupleDialog && (
        <AddCoupleDialog
          open={openCoupleDialog}
          side={side}
          onClose={() => setOpenCoupleDialog(false)}
        />
      )}
    </Box>
  );
};
