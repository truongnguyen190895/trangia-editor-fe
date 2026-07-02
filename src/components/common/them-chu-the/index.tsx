import { Fragment, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useThemChuTheContext } from "@/context/them-chu-the";
import { ThemCaNhanDialog } from "./them-ca-nhan-dialog";
import { ThemVoChongDialog } from "./them-vo-chong-dialog";
import { FormSection } from "@/components/common/form-section";

interface ThemChuTheProps {
  title: string;
  side: "partyA" | "partyB";
  /** Anchor id for SectionNav */
  id?: string;
  /** Roman numeral shown before the title (mirrors the contract's sections) */
  numeral?: string;
}

export const ThemChuThe = ({ title, side, id, numeral }: ThemChuTheProps) => {
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
  } = useThemChuTheContext();
  const [openSingleDialog, setOpenSingleDialog] = useState(false);
  const [openCoupleDialog, setOpenCoupleDialog] = useState(false);
  const partyEntities = side === "partyA" ? partyA : partyB;
  const individualParty = partyEntities["cá_nhân"];
  const coupleParty = partyEntities["vợ_chồng"];
  const hasMembers = individualParty.length > 0 || coupleParty.length > 0;

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

  const actionCells = (onEdit: () => void, onDelete: () => void) => (
    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
      <IconButton size="small" onClick={onEdit} aria-label="Xem / sửa">
        <VisibilityIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={onEdit} aria-label="Sửa">
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        onClick={onDelete}
        aria-label="Xóa"
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </TableCell>
  );

  const headRow = (
    <TableHead>
      <TableRow>
        <TableCell>Giới tính</TableCell>
        <TableCell>Tên</TableCell>
        <TableCell>Ngày sinh</TableCell>
        <TableCell>Loại giấy tờ</TableCell>
        <TableCell>Số giấy tờ</TableCell>
        <TableCell align="right">Thao tác</TableCell>
      </TableRow>
    </TableHead>
  );

  return (
    <FormSection id={id} numeral={numeral} title={title} complete={hasMembers}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Chủ thể là cá nhân</Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setOpenSingleDialog(true)}
            >
              Thêm cá nhân
            </Button>
          </Box>
          {individualParty.length > 0 && (
            <Table size="small" sx={{ mt: 1 }}>
              {headRow}
              <TableBody>
                {individualParty.map((entity, index) => (
                  <TableRow key={index}>
                    <TableCell>{entity["giới_tính"]}</TableCell>
                    <TableCell>{entity.tên}</TableCell>
                    <TableCell>{entity["ngày_sinh"]}</TableCell>
                    <TableCell>{entity["loại_giấy_tờ"]}</TableCell>
                    <TableCell>{entity["số_giấy_tờ"]}</TableCell>
                    {actionCells(
                      () => handleEditSingleParty(index),
                      () => handleDeleteSingleParty(index),
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
        <Divider />
        <Box>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Chủ thể là vợ chồng</Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setOpenCoupleDialog(true)}
            >
              Thêm vợ chồng
            </Button>
          </Box>
          {coupleParty.length > 0 && (
            <Table size="small" sx={{ mt: 1 }}>
              {headRow}
              <TableBody>
                {coupleParty.map((entity, index) => (
                  <Fragment key={index}>
                    <TableRow>
                      <TableCell>{entity.chồng["giới_tính"]}</TableCell>
                      <TableCell>{entity.chồng.tên}</TableCell>
                      <TableCell>{entity.chồng["ngày_sinh"]}</TableCell>
                      <TableCell>{entity.chồng["loại_giấy_tờ"]}</TableCell>
                      <TableCell>{entity.chồng["số_giấy_tờ"]}</TableCell>
                      {actionCells(
                        () => handleEditCoupleParty(index),
                        () => handleDeleteCoupleParty(index),
                      )}
                    </TableRow>
                    <TableRow>
                      <TableCell>{entity.vợ["giới_tính"]}</TableCell>
                      <TableCell>{entity.vợ.tên}</TableCell>
                      <TableCell>{entity.vợ["ngày_sinh"]}</TableCell>
                      <TableCell>{entity.vợ["loại_giấy_tờ"]}</TableCell>
                      <TableCell>{entity.vợ["số_giấy_tờ"]}</TableCell>
                      {actionCells(
                        () => handleEditCoupleParty(index),
                        () => handleDeleteCoupleParty(index),
                      )}
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Box>
      {openSingleDialog && (
        <ThemCaNhanDialog
          open={openSingleDialog}
          side={side}
          onClose={() => setOpenSingleDialog(false)}
        />
      )}
      {openCoupleDialog && (
        <ThemVoChongDialog
          open={openCoupleDialog}
          side={side}
          onClose={() => setOpenCoupleDialog(false)}
        />
      )}
    </FormSection>
  );
};
