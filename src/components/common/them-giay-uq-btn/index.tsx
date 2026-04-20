import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { useThemChuTheContext } from "@/context/them-chu-the";
import type { GiayUyQuyen } from "@/models/guq";
import { generateGiayUyQuyen } from "@/api/giay_uy_quyen";
import { createDownloadLink, extractCoupleFromParty } from "@/utils/common";
import { extractAddress } from "@/utils/extract-address";
import { ThemNguoiDuocUQDialog } from "./them-nguoi-duoc-uq-dialog";
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";

type NguoiDuocUQ = GiayUyQuyen["nguoi_duoc_uq"][number];

export const ThemGiayUQButton = () => {
  const { partyB } = useThemChuTheContext();
  const { agreementObject } = useHdcnQuyenSdDatContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [nguoiDuocUQList, setNguoiDuocUQList] = useState<NguoiDuocUQ[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  const handleOpenAdd = () => {
    setEditIndex(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditIndex(index);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditIndex(null);
  };

  const handleSubmitForm = (value: NguoiDuocUQ) => {
    if (editIndex !== null) {
      setNguoiDuocUQList((prev) =>
        prev.map((item, i) => (i === editIndex ? value : item)),
      );
    } else {
      setNguoiDuocUQList((prev) => [...prev, value]);
    }
  };

  const handleDelete = (index: number) => {
    setNguoiDuocUQList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    const couplesB = extractCoupleFromParty(partyB);
    const payload: GiayUyQuyen = {
      bên_B: {
        cá_thể: [
          ...partyB["cá_nhân"].map((person) => ({
            ...person,
            ngày_sinh: person["ngày_sinh"],
            ngày_cấp: person["ngày_cấp"],
            tình_trạng_hôn_nhân: person["tình_trạng_hôn_nhân"] || null,
            tình_trạng_hôn_nhân_vợ_chồng: null,
            quan_hệ: person["quan_hệ"] || null,
            ...extractAddress(person["địa_chỉ_thường_trú"]),
          })),
          ...couplesB,
        ],
      },
      địa_chỉ_hiển_thị: agreementObject
        ? agreementObject["địa_chỉ_cũ"]
          ? `${agreementObject["địa_chỉ_cũ"]} (nay là ${agreementObject["địa_chỉ_mới"]})`
          : agreementObject["địa_chỉ_mới"]
        : "",
      loại_giấy_chứng_nhận: agreementObject?.["loại_giấy_chứng_nhận"] ?? "",
      số_giấy_chứng_nhận: agreementObject?.["số_giấy_chứng_nhận"] ?? "",
      số_vào_sổ_cấp_giấy_chứng_nhận:
        agreementObject?.["số_vào_sổ_cấp_giấy_chứng_nhận"] ?? "",
      nơi_cấp_giấy_chứng_nhận:
        agreementObject?.["nơi_cấp_giấy_chứng_nhận"] ?? "",
      ngày_cấp_giấy_chứng_nhận:
        agreementObject?.["ngày_cấp_giấy_chứng_nhận"] ?? "",
      nguoi_duoc_uq: nguoiDuocUQList,
    };
    setIsGenerating(true);
    generateGiayUyQuyen(payload)
      .then((resp) => {
        createDownloadLink(resp.data, "giay-uy-quyen");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Tạo giấy UQ thất bại");
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  return (
    <Box>
      <Button
        sx={{
          height: "50px",
          fontSize: "1.2rem",
          fontWeight: "600",
          textTransform: "uppercase",
        }}
        variant="contained"
        onClick={handleOpen}
      >
        Giấy UQ
      </Button>
      <Dialog fullWidth maxWidth="lg" open={isOpen} onClose={handleClose}>
        <DialogTitle>GUQ</DialogTitle>
        <DialogContent>
          <Box mt="1rem">
            <Typography variant="h6">Bên nhận uỷ quyền</Typography>
            {nguoiDuocUQList.length > 0 ? (
              <Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Giới tính</TableCell>
                      <TableCell>Tên</TableCell>
                      <TableCell>Ngày sinh</TableCell>
                      <TableCell>Loại giấy tờ</TableCell>
                      <TableCell>Số giấy tờ</TableCell>
                      <TableCell>Ngày cấp</TableCell>
                      <TableCell>Nơi cấp</TableCell>
                      <TableCell>Sửa</TableCell>
                      <TableCell>Xoá</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {nguoiDuocUQList.map((entity, index) => (
                      <TableRow
                        key={index}
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
                        <TableCell>{entity["ngày_sinh"]}</TableCell>
                        <TableCell>{entity["loại_giấy_tờ"]}</TableCell>
                        <TableCell>{entity["số_giấy_tờ"]}</TableCell>
                        <TableCell>{entity["ngày_cấp"]}</TableCell>
                        <TableCell>{entity["nơi_cấp"]}</TableCell>
                        <TableCell>
                          <EditIcon
                            className="icon-action"
                            color="info"
                            onClick={() => handleOpenEdit(index)}
                          />
                        </TableCell>
                        <TableCell>
                          <DeleteIcon
                            className="icon-action"
                            color="error"
                            onClick={() => handleDelete(index)}
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
                    onClick={handleOpenAdd}
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
                  onClick={handleOpenAdd}
                >
                  <Typography variant="body1">
                    Thêm người được uỷ quyền
                  </Typography>
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Hủy
          </Button>
          <Button
            variant="contained"
            color="success"
            disabled={isGenerating}
            onClick={handleGenerate}
            startIcon={
              isGenerating ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            Tạo giấy UQ
          </Button>
        </DialogActions>
      </Dialog>
      {isFormOpen && (
        <ThemNguoiDuocUQDialog
          open={isFormOpen}
          initialValue={editIndex !== null ? nguoiDuocUQList[editIndex] : null}
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
        />
      )}
    </Box>
  );
};
