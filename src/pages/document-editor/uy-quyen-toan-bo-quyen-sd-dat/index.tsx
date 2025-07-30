import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  Checkbox,
} from "@mui/material";
import { PartyEntity } from "./components/party-entity";
import { ObjectEntity } from "./components/object";
import SearchIcon from "@mui/icons-material/Search";
import { CircularProgress } from "@mui/material";
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";
import type { UyQuyenToanBoQuyenSdDatPayload } from "@/models/uy-quyen";
import dayjs from "dayjs";
import { render_uy_quyen_toan_bo_quyen_su_dung_dat } from "@/api";
import { translateDateToVietnamese } from "@/utils/date-to-words";
import { numberToVietnamese } from "@/utils/number-to-words";
import { extractAddress } from "@/utils/extract-address";

export const UyQuyenToanBoQuyenSdDat = () => {
  const { partyA, partyB, agreementObject } = useHdcnQuyenSdDatContext();
  const { palette } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [sốBảnGốc, setSốBảnGốc] = useState<number>(2);
  const [openDialog, setOpenDialog] = useState(false);
  const [isOutSide, setIsOutSide] = useState(false);

  const isFormValid =
    (partyA["cá_nhân"].length > 0 || partyA["vợ_chồng"].length > 0) &&
    (partyB["cá_nhân"].length > 0 || partyB["vợ_chồng"].length > 0) &&
    agreementObject !== null;

  const getPayload = (): UyQuyenToanBoQuyenSdDatPayload => {
    if (!agreementObject) {
      throw new Error("Agreement object is null");
    }

    const couplesA = partyA["vợ_chồng"]
      .map((couple) => ({
        ...couple.chồng,
        ngày_sinh: dayjs(couple.chồng["ngày_sinh"]).format("DD/MM/YYYY"),
        ngày_cấp: dayjs(couple.chồng["ngày_cấp"]).format("DD/MM/YYYY"),
        tình_trạng_hôn_nhân: null,
        ...extractAddress(couple.chồng["địa_chỉ_thường_trú"]),
        tình_trạng_hôn_nhân_vợ_chồng:
          couple.chồng["tình_trạng_hôn_nhân_vợ_chồng"],
      }))
      .concat(
        partyA["vợ_chồng"].map((couple) => ({
          ...couple.vợ,
          quan_hệ: "vợ",
          ngày_sinh: dayjs(couple.vợ["ngày_sinh"]).format("DD/MM/YYYY"),
          ngày_cấp: dayjs(couple.vợ["ngày_cấp"]).format("DD/MM/YYYY"),
          tình_trạng_hôn_nhân: null,
          ...extractAddress(couple.vợ["địa_chỉ_thường_trú"]),
          tình_trạng_hôn_nhân_vợ_chồng:
            couple.vợ["tình_trạng_hôn_nhân_vợ_chồng"],
        }))
      );
    const couplesB = partyB["vợ_chồng"]
      .map((couple) => ({
        ...couple.chồng,
        ngày_sinh: dayjs(couple.chồng["ngày_sinh"]).format("DD/MM/YYYY"),
        ngày_cấp: dayjs(couple.chồng["ngày_cấp"]).format("DD/MM/YYYY"),
        tình_trạng_hôn_nhân: null,
        tình_trạng_hôn_nhân_vợ_chồng:
          couple.chồng["tình_trạng_hôn_nhân_vợ_chồng"],
        thành_phố: null,
        phường: null,
        thôn: null,
      }))
      .concat(
        partyB["vợ_chồng"].map((couple) => ({
          ...couple.vợ,
          quan_hệ: "vợ",
          ngày_sinh: dayjs(couple.vợ["ngày_sinh"]).format("DD/MM/YYYY"),
          ngày_cấp: dayjs(couple.vợ["ngày_cấp"]).format("DD/MM/YYYY"),
          tình_trạng_hôn_nhân: null,
          tình_trạng_hôn_nhân_vợ_chồng:
            couple.vợ["tình_trạng_hôn_nhân_vợ_chồng"],
          thành_phố: null,
          phường: null,
          thôn: null,
        }))
      );

    const payload: UyQuyenToanBoQuyenSdDatPayload = {
      bên_A: {
        cá_thể: [
          ...partyA["cá_nhân"].map((person) => ({
            ...person,
            ngày_sinh: dayjs(person["ngày_sinh"]).format("DD/MM/YYYY"),
            ngày_cấp: dayjs(person["ngày_cấp"]).format("DD/MM/YYYY"),
            tình_trạng_hôn_nhân: person["tình_trạng_hôn_nhân"] || null,
            quan_hệ: person["quan_hệ"] || null,
            tình_trạng_hôn_nhân_vợ_chồng: null,
            thành_phố: null,
            phường: null,
            thôn: null,
          })),
          ...couplesA,
        ],
      },
      bên_B: {
        cá_thể: [
          ...partyB["cá_nhân"].map((person) => ({
            ...person,
            ngày_sinh: dayjs(person["ngày_sinh"]).format("DD/MM/YYYY"),
            ngày_cấp: dayjs(person["ngày_cấp"]).format("DD/MM/YYYY"),
            tình_trạng_hôn_nhân: person["tình_trạng_hôn_nhân"] || null,
            quan_hệ: person["quan_hệ"] || null,
            tình_trạng_hôn_nhân_vợ_chồng: null,
            thành_phố: null,
            phường: null,
            thôn: null,
          })),
          ...couplesB,
        ],
      },
      số_thửa_đất: agreementObject["số_thửa_đất"],
      số_tờ_bản_đồ: agreementObject["số_tờ_bản_đồ"],
      địa_chỉ_hiển_thị: agreementObject["địa_chỉ_cũ"]
        ? `${agreementObject["địa_chỉ_cũ"]} (nay là ${agreementObject["địa_chỉ_mới"]})`
        : agreementObject["địa_chỉ_mới"],
      loại_giấy_chứng_nhận: agreementObject["loại_giấy_chứng_nhận"],
      số_giấy_chứng_nhận: agreementObject["số_giấy_chứng_nhận"],
      số_vào_sổ_cấp_giấy_chứng_nhận:
        agreementObject["số_vào_sổ_cấp_giấy_chứng_nhận"],
      ngày_cấp_giấy_chứng_nhận: dayjs(
        agreementObject["ngày_cấp_giấy_chứng_nhận"]
      ).format("DD/MM/YYYY"),
      nơi_cấp_giấy_chứng_nhận: agreementObject["nơi_cấp_giấy_chứng_nhận"],
      ngày: dayjs().format("DD/MM/YYYY").toString(),
      ngày_bằng_chữ: translateDateToVietnamese(
        dayjs().format("DD/MM/YYYY").toString()
      ),
      số_bản_gốc: sốBảnGốc < 10 ? "0" + String(sốBảnGốc) : String(sốBảnGốc),
      số_bản_gốc_bằng_chữ: numberToVietnamese(
        String(sốBảnGốc)
      )?.toLocaleLowerCase(),
      số_bản_công_chứng:
        sốBảnGốc - 1 < 10 ? "0" + String(sốBảnGốc - 1) : String(sốBảnGốc - 1),
      số_bản_công_chứng_bằng_chữ: numberToVietnamese(
        String(sốBảnGốc - 1)
      )?.toLocaleLowerCase(),
      thời_hạn: agreementObject["thời_hạn"] ?? "",
      thời_hạn_bằng_chữ: agreementObject["thời_hạn_bằng_chữ"] ?? "",
      ký_bên_ngoài: isOutSide,
    };

    return payload;
  };

  const handleGenerateDocument = () => {
    const payload = getPayload();
    setOpenDialog(false);
    setIsGenerating(true);
    render_uy_quyen_toan_bo_quyen_su_dung_dat(payload)
      .then((res) => {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Uỷ quyền toàn bộ quyền sử dụng đất.docx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error generating document:", error);
        window.alert("Lỗi khi tạo hợp đồng");
      })
      .finally(() => {
        setIsGenerating(false);
        setSốBảnGốc(2);
        setIsOutSide(false);
      });
  };

  return (
    <Box display="flex" gap="2rem">
      <Box
        border="1px solid #BCCCDC"
        borderRadius="5px"
        padding="1rem"
        display="none" // TODO: temporary hide search
        flex={1}
      >
        <Typography variant="h6">Tìm kiếm</Typography>
        <TextField
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          fullWidth
          placeholder="Tên hoặc CCCD/CMND/Hộ chiếu"
          sx={{ mt: 2 }}
        />
      </Box>
      <Box
        className="full-land-transfer"
        display="flex"
        gap="4rem"
        flexDirection="column"
        border="1px solid #BCCCDC"
        borderRadius="5px"
        padding="1rem"
        flex={4}
      >
        <PartyEntity title="Bên A" side="partyA" />
        <PartyEntity title="Bên B" side="partyB" />
        <ObjectEntity title="Đối tượng uỷ quyền" />
        <Box display="flex" gap="1rem">
          <Button
            variant="contained"
            sx={{
              backgroundColor: palette.softTeal,
              height: "50px",
              fontSize: "1.2rem",
              fontWeight: "600",
              textTransform: "uppercase",
              width: "350px",
            }}
            disabled={!isFormValid}
            onClick={() => setOpenDialog(true)}
          >
            {isGenerating ? (
              <CircularProgress size={20} />
            ) : (
              "Tạo hợp đồng uỷ quyền"
            )}
          </Button>
        </Box>
      </Box>
      <Dialog
        open={openDialog}
        fullWidth
        maxWidth="md"
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Thông tin hợp đồng</DialogTitle>
        <DialogContent>
          <Box>
            <Box display="flex" gap="0.5rem" alignItems="center">
              <InputLabel
                htmlFor="sốBảnGốc"
                sx={{ fontSize: "1.2rem", fontWeight: "600" }}
              >
                Số bản gốc
              </InputLabel>
              <TextField
                type="number"
                name="sốBảnGốc"
                slotProps={{
                  htmlInput: {
                    min: 2,
                  },
                }}
                value={sốBảnGốc}
                onChange={(e) => setSốBảnGốc(Number(e.target.value))}
              />
            </Box>

            <Box display="flex" alignItems="center" gap="0.5rem">
              <InputLabel
                htmlFor="isOutSide"
                sx={{ fontSize: "1.2rem", fontWeight: "600" }}
              >
                Hợp đồng được ký bên ngoài văn phòng?
              </InputLabel>
              <Checkbox
                id="isOutSide"
                size="large"
                color="info"
                checked={isOutSide}
                onChange={() => setIsOutSide(!isOutSide)}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenDialog(false)}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={sốBảnGốc <= 0}
            onClick={handleGenerateDocument}
          >
            Tạo hợp đồng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
