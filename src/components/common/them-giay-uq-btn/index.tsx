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
  TextField,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useThemChuTheContext } from "@/context/them-chu-the";
import { GUQ_TEMPLATE, type GiayUyQuyen, type GuqTemplate } from "@/models/guq";
import { generateGiayUyQuyen } from "@/api/giay_uy_quyen";
import { createDownloadLink, extractCoupleFromParty } from "@/utils/common";
import { extractAddress } from "@/utils/extract-address";
import { translateDatePartsToVietnamese } from "@/utils/date-to-words";
import { ThemNguoiDuocUQDialog } from "./them-nguoi-duoc-uq-dialog";
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";

type NguoiDuocUQ = GiayUyQuyen["nguoi_duoc_uq"][number];

const TÊN_HỢP_ĐỒNG_VAC = "Hợp đồng chuyển nhượng quyền sử dụng đất";

export const ThemGiayUQButton = () => {
  const { partyB } = useThemChuTheContext();
  const { agreementObject } = useHdcnQuyenSdDatContext();
  const [chooserOpen, setChooserOpen] = useState<boolean>(false);
  const [template, setTemplate] = useState<GuqTemplate | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [nguoiDuocUQList, setNguoiDuocUQList] = useState<NguoiDuocUQ[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [ngàyVAC, setNgàyVAC] = useState<string>(dayjs().format("DD/MM/YYYY"));

  const handleClose = () => {
    setIsOpen(false);
    setTemplate(null);
  };
  const handleOpen = () => setChooserOpen(true);

  const pickTemplate = (t: GuqTemplate) => {
    setTemplate(t);
    setChooserOpen(false);
    setIsOpen(true);
  };

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
    if (!template) return;
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

    if (template === GUQ_TEMPLATE.VAC) {
      const [d, m, y] = ngàyVAC.split("/");
      const parts = translateDatePartsToVietnamese(ngàyVAC);
      const now = dayjs();
      payload["số_thửa_đất"] = agreementObject?.["số_thửa_đất"] ?? "";
      payload["số_tờ_bản_đồ"] = agreementObject?.["số_tờ_bản_đồ"] ?? "";
      payload["tên_hợp_đồng"] = TÊN_HỢP_ĐỒNG_VAC;
      payload["ngày"] = d ?? "";
      payload["tháng"] = m ?? "";
      payload["năm"] = y ?? "";
      payload["giờ_soạn"] = now.format("HH");
      payload["phút_soạn"] = now.format("mm");
      payload["ngày_bằng_chữ"] = parts.ngày;
      payload["tháng_bằng_chữ"] = parts.tháng;
      payload["năm_bằng_chữ"] = parts.năm;
    }

    setIsGenerating(true);
    generateGiayUyQuyen(payload, template)
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
      <Dialog open={chooserOpen} onClose={() => setChooserOpen(false)}>
        <DialogTitle>Chọn loại giấy uỷ quyền</DialogTitle>
        <DialogContent>
          <Typography>Bạn muốn tạo GUQ loại nào?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChooserOpen(false)}>Hủy</Button>
          <Button onClick={() => pickTemplate(GUQ_TEMPLATE.CM)}>
            GUQ - (CM)
          </Button>
          <Button
            variant="contained"
            onClick={() => pickTemplate(GUQ_TEMPLATE.VAC)}
          >
            GUQ - VAC
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth maxWidth="lg" open={isOpen} onClose={handleClose}>
        <DialogTitle>
          GUQ{template === GUQ_TEMPLATE.VAC ? " - VAC" : ""}
        </DialogTitle>
        <DialogContent>
          {template === GUQ_TEMPLATE.VAC && (
            <Box mt="1rem">
              <Typography variant="h6">Ngày lập</Typography>
              <TextField
                value={ngàyVAC}
                onChange={(e) => setNgàyVAC(e.target.value)}
                placeholder="DD/MM/YYYY"
                size="small"
                sx={{ mt: 1, width: 220 }}
              />
            </Box>
          )}
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
