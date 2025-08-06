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
import SearchIcon from "@mui/icons-material/Search";
import { CircularProgress } from "@mui/material";
import type { NhomHuySuaDoiPayload } from "@/models/nhom-huy-sua-doi";
import dayjs from "dayjs";
import {
  render_vb_huy,
  render_vb_cham_dut_hd,
  render_vb_cham_dut_hq_uy_quyen,
} from "@/api";
import { translateDateToVietnamese } from "@/utils/date-to-words";
import { numberToVietnamese } from "@/utils/number-to-words";
import { useHDMBXeContext } from "@/context/hdmb-xe";

interface NhomHuySuaDoiProps {
  isHuy?: boolean;
  isChamDutHD?: boolean;
  isChamDutHQUyQuyen?: boolean;
}

export const NhomHuySuaDoi = ({
  isHuy = false,
  isChamDutHD = false,
  isChamDutHQUyQuyen = false,
}: NhomHuySuaDoiProps) => {
  const { partyA, partyB } = useHDMBXeContext();
  const { palette } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [sốBảnGốc, setSốBảnGốc] = useState<number>(4);
  const [openDialog, setOpenDialog] = useState(false);
  const [isOutSide, setIsOutSide] = useState(false);

  const validatePayload = (): boolean => {
    if (isHuy) {
      return partyA["cá_nhân"].length > 0 || partyA["vợ_chồng"].length > 0;
    }
    return (
      (partyA["cá_nhân"].length > 0 || partyA["vợ_chồng"].length > 0) &&
      (partyB["cá_nhân"].length > 0 || partyB["vợ_chồng"].length > 0)
    );
  };

  const getPayload = (): NhomHuySuaDoiPayload => {
    const couplesA = partyA["vợ_chồng"]
      .map((couple) => ({
        ...couple.chồng,
        ngày_sinh: couple.chồng["ngày_sinh"],
        ngày_cấp: couple.chồng["ngày_cấp"],
        tình_trạng_hôn_nhân: null,
        tình_trạng_hôn_nhân_vợ_chồng:
          couple.chồng["tình_trạng_hôn_nhân_vợ_chồng"],
      }))
      .concat(
        partyA["vợ_chồng"].map((couple) => ({
          ...couple.vợ,
          quan_hệ: "vợ",
          ngày_sinh: couple.vợ["ngày_sinh"],
          ngày_cấp: couple.vợ["ngày_cấp"],
          tình_trạng_hôn_nhân: null,
          tình_trạng_hôn_nhân_vợ_chồng:
            couple.vợ["tình_trạng_hôn_nhân_vợ_chồng"],
        }))
      );
    const couplesB = partyB["vợ_chồng"]
      .map((couple) => ({
        ...couple.chồng,
        ngày_sinh: couple.chồng["ngày_sinh"],
        ngày_cấp: couple.chồng["ngày_cấp"],
        tình_trạng_hôn_nhân: null,
        tình_trạng_hôn_nhân_vợ_chồng:
          couple.chồng["tình_trạng_hôn_nhân_vợ_chồng"],
      }))
      .concat(
        partyB["vợ_chồng"].map((couple) => ({
          ...couple.vợ,
          quan_hệ: "vợ",
          ngày_sinh: couple.vợ["ngày_sinh"],
          ngày_cấp: couple.vợ["ngày_cấp"],
          tình_trạng_hôn_nhân: null,
          tình_trạng_hôn_nhân_vợ_chồng:
            couple.vợ["tình_trạng_hôn_nhân_vợ_chồng"],
        }))
      );

    const payload: NhomHuySuaDoiPayload = {
      bên_A: {
        cá_thể: [
          ...partyA["cá_nhân"].map((person) => ({
            ...person,
            ngày_sinh: person["ngày_sinh"],
            ngày_cấp: person["ngày_cấp"],
            tình_trạng_hôn_nhân: person["tình_trạng_hôn_nhân"] || null,
            quan_hệ: person["quan_hệ"] || null,
            tình_trạng_hôn_nhân_vợ_chồng: null,
          })),
          ...couplesA,
        ],
      },
      bên_B: {
        cá_thể: [
          ...partyB["cá_nhân"].map((person) => ({
            ...person,
            ngày_sinh: person["ngày_sinh"],
            ngày_cấp: person["ngày_cấp"],
            tình_trạng_hôn_nhân: person["tình_trạng_hôn_nhân"] || null,
            quan_hệ: person["quan_hệ"] || null,
            tình_trạng_hôn_nhân_vợ_chồng: null,
          })),
          ...couplesB,
        ],
      },
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
      ký_bên_ngoài: isOutSide,
    };

    return payload;
  };

  const handleGenerateDocument = () => {
    const payload = getPayload();
    setOpenDialog(false);
    setIsGenerating(true);

    if (isHuy) {
      render_vb_huy(payload)
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "VB-Huy.docx";
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
          setSốBảnGốc(4);
          setIsOutSide(false);
        });
    } else if (isChamDutHD) {
      render_vb_cham_dut_hd(payload)
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "VB-cham-dut-hd.docx";
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
          setSốBảnGốc(4);
          setIsOutSide(false);
        });
    } else if (isChamDutHQUyQuyen) {
      render_vb_cham_dut_hq_uy_quyen(payload)
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "VB-cham-dut-hq-uy-quyen.docx";
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
          setSốBảnGốc(4);
          setIsOutSide(false);
        });
    }
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
        {!isHuy && <PartyEntity title="Bên B" side="partyB" />}
        <Box display="flex" gap="1rem">
          <Button
            variant="contained"
            sx={{
              backgroundColor: palette.softTeal,
              height: "50px",
              fontSize: "1.2rem",
              fontWeight: "600",
              textTransform: "uppercase",
              width: "200px",
            }}
            disabled={!validatePayload()}
            onClick={() => setOpenDialog(true)}
          >
            {isGenerating ? <CircularProgress size={20} /> : "Tạo hợp đồng"}
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
