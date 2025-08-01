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
import type {
  HDCNQuyenSDDatPayload,
  SampleToKhaiChungPayload,
} from "@/models/agreement-entity";
import dayjs from "dayjs";
import {
  render_hdcn_quyen_sd_dat_toan_bo,
  render_khai_thue_chuyen_nhuong_dat_va_dat_nong_nghiep,
  render_khai_thue_tang_cho_dat_va_dat_nong_nghiep_toan_bo,
  render_hdtc_dat_toan_bo,
} from "@/api";
import { translateDateToVietnamese } from "@/utils/date-to-words";
import { numberToVietnamese } from "@/utils/number-to-words";
import { extractAddress } from "@/utils/extract-address";
import { generateThoiHanSuDung } from "@/utils/common";

interface Props {
  isNongNghiep?: boolean;
  isTangCho?: boolean;
}

export const ChuyenNhuongDatToanBo = ({
  isNongNghiep = false,
  isTangCho = false,
}: Props) => {
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

  const getPayload = (): HDCNQuyenSDDatPayload => {
    if (!agreementObject) {
      throw new Error("Agreement object is null");
    }

    const couplesA = partyA["vợ_chồng"]
      .map((couple) => ({
        ...couple.chồng,
        ngày_sinh: dayjs(couple.chồng["ngày_sinh"]).format("DD/MM/YYYY"),
        ngày_cấp: dayjs(couple.chồng["ngày_cấp"]).format("DD/MM/YYYY"),
        tình_trạng_hôn_nhân: null,
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
        }))
      );

    const payload: HDCNQuyenSDDatPayload = {
      bên_A: {
        cá_thể: [
          ...partyA["cá_nhân"].map((person) => ({
            ...person,
            ngày_sinh: dayjs(person["ngày_sinh"]).format("DD/MM/YYYY"),
            ngày_cấp: dayjs(person["ngày_cấp"]).format("DD/MM/YYYY"),
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
            ngày_sinh: dayjs(person["ngày_sinh"]).format("DD/MM/YYYY"),
            ngày_cấp: dayjs(person["ngày_cấp"]).format("DD/MM/YYYY"),
            tình_trạng_hôn_nhân: person["tình_trạng_hôn_nhân"] || null,
            quan_hệ: person["quan_hệ"] || null,
            tình_trạng_hôn_nhân_vợ_chồng: null,
          })),
          ...couplesB,
        ],
      },
      số_thửa_đất: agreementObject["số_thửa_đất"],
      số_tờ_bản_đồ: agreementObject["số_tờ_bản_đồ"],
      địa_chỉ_cũ: agreementObject["địa_chỉ_cũ"],
      địa_chỉ_hiển_thị: agreementObject["địa_chỉ_cũ"]
        ? `${agreementObject["địa_chỉ_cũ"]} (nay là ${agreementObject["địa_chỉ_mới"]})`
        : agreementObject["địa_chỉ_mới"],
      địa_chỉ_mới: agreementObject["địa_chỉ_mới"],
      loại_giấy_chứng_nhận: agreementObject["loại_giấy_chứng_nhận"],
      số_giấy_chứng_nhận: agreementObject["số_giấy_chứng_nhận"],
      số_vào_sổ_cấp_giấy_chứng_nhận:
        agreementObject["số_vào_sổ_cấp_giấy_chứng_nhận"],
      ngày_cấp_giấy_chứng_nhận: dayjs(
        agreementObject["ngày_cấp_giấy_chứng_nhận"]
      ).format("DD/MM/YYYY"),
      nơi_cấp_giấy_chứng_nhận: agreementObject["nơi_cấp_giấy_chứng_nhận"],
      đặc_điểm_thửa_đất: {
        diện_tích: {
          số: agreementObject["diện_tích"],
          chữ: agreementObject["diện_tích_bằng_chữ"],
        },
        hình_thức_sử_dụng: agreementObject["hình_thức_sử_dụng"],
        mục_đích_và_thời_hạn_sử_dụng: agreementObject[
          "mục_đích_và_thời_hạn_sử_dụng"
        ]?.map((item) => ({
          phân_loại: item["phân_loại"],
          diện_tích: item["diện_tích"] || null,
          thời_hạn_sử_dụng: item["thời_hạn_sử_dụng"],
        })),
        thời_hạn: generateThoiHanSuDung(
          agreementObject["mục_đích_và_thời_hạn_sử_dụng"]
        )?.trim(),
        nguồn_gốc_sử_dụng: agreementObject["nguồn_gốc_sử_dụng"],
        ghi_chú: agreementObject["ghi_chú"],
      },
      số_tiền: agreementObject["giá_tiền"],
      số_tiền_bằng_chữ: agreementObject["giá_tiền_bằng_chữ"],
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
    if (isTangCho) {
      render_hdtc_dat_toan_bo(payload, isNongNghiep)
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `HDTC đất ${
            isNongNghiep ? "nông nghiệp" : ""
          } toàn bộ - ${payload["bên_A"]["cá_thể"][0]["tên"]} - ${
            payload["bên_B"]["cá_thể"][0]["tên"]
          }.docx`;
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
    } else {
      render_hdcn_quyen_sd_dat_toan_bo(payload, isNongNghiep)
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `Hợp đồng chuyển nhượng - ${payload["bên_A"]["cá_thể"][0]["tên"]} - ${payload["bên_B"]["cá_thể"][0]["tên"]}.docx`;
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
    }
  };

  const getPayloadToKhaiChung = (): SampleToKhaiChungPayload => {
    if (!agreementObject) {
      throw new Error("Agreement object is null");
    }

    const couplesA = partyA["vợ_chồng"]
      .map((couple) => ({
        ...couple.chồng,
        ngày_sinh: dayjs(couple.chồng["ngày_sinh"]).format("DD/MM/YYYY"),
        ngày_cấp: dayjs(couple.chồng["ngày_cấp"]).format("DD/MM/YYYY"),
        tình_trạng_hôn_nhân: null,
        quan_hệ: null,
        ...extractAddress(couple.chồng["địa_chỉ_thường_trú"]),
      }))
      .concat(
        partyA["vợ_chồng"].map((couple) => ({
          ...couple.vợ,
          quan_hệ: null,
          ngày_sinh: dayjs(couple.vợ["ngày_sinh"]).format("DD/MM/YYYY"),
          ngày_cấp: dayjs(couple.vợ["ngày_cấp"]).format("DD/MM/YYYY"),
          tình_trạng_hôn_nhân: null,
          ...extractAddress(couple.vợ["địa_chỉ_thường_trú"]),
        }))
      );
    const couplesB = partyB["vợ_chồng"]
      .map((couple) => ({
        ...couple.chồng,
        ngày_sinh: dayjs(couple.chồng["ngày_sinh"]).format("DD/MM/YYYY"),
        ngày_cấp: dayjs(couple.chồng["ngày_cấp"]).format("DD/MM/YYYY"),
        tình_trạng_hôn_nhân: null,
        ...extractAddress(couple.chồng["địa_chỉ_thường_trú"]),
      }))
      .concat(
        partyB["vợ_chồng"].map((couple) => ({
          ...couple.vợ,
          quan_hệ: null,
          ngày_sinh: dayjs(couple.vợ["ngày_sinh"]).format("DD/MM/YYYY"),
          ngày_cấp: dayjs(couple.vợ["ngày_cấp"]).format("DD/MM/YYYY"),
          tình_trạng_hôn_nhân: null,
          ...extractAddress(couple.vợ["địa_chỉ_thường_trú"]),
        }))
      );

    const các_cá_thể_bên_A = [
      ...partyA["cá_nhân"].map((person) => ({
        ...person,
        ngày_sinh: dayjs(person["ngày_sinh"]).format("DD/MM/YYYY"),
        ngày_cấp: dayjs(person["ngày_cấp"]).format("DD/MM/YYYY"),
        tình_trạng_hôn_nhân: person["tình_trạng_hôn_nhân"] || null,
        ...extractAddress(person["địa_chỉ_thường_trú"]),
      })),
      ...couplesA,
    ];
    const các_cá_thể_bên_B = [
      ...partyB["cá_nhân"].map((person) => ({
        ...person,
        ngày_sinh: dayjs(person["ngày_sinh"]).format("DD/MM/YYYY"),
        ngày_cấp: dayjs(person["ngày_cấp"]).format("DD/MM/YYYY"),
        tình_trạng_hôn_nhân: person["tình_trạng_hôn_nhân"] || null,
        ...extractAddress(person["địa_chỉ_thường_trú"]),
      })),
      ...couplesB,
    ];

    const payload: SampleToKhaiChungPayload = {
      bên_A: {
        cá_thể: các_cá_thể_bên_A,
      },
      bên_B: {
        cá_thể: các_cá_thể_bên_B,
      },
      bảng_tncn_bên_A: các_cá_thể_bên_A.map((person, index) => ({
        stt: index + 1,
        tên: person["tên"],
        số_giấy_tờ: person["số_giấy_tờ"],
      })),
      bảng_trước_bạ_bên_B: các_cá_thể_bên_B.map((person, index) => ({
        stt: index + 1,
        tên: person["tên"],
        số_giấy_tờ: person["số_giấy_tờ"],
      })),
      bảng_bên_A: các_cá_thể_bên_A.map((person, index) => ({
        stt: index + 1,
        tên: person["tên"],
      })),
      tables: ["bảng_bên_A", "bảng_tncn_bên_A", "bảng_trước_bạ_bên_B"],
      số_thửa_đất: agreementObject["số_thửa_đất"],
      số_tờ_bản_đồ: agreementObject["số_tờ_bản_đồ"],
      loại_giấy_tờ: agreementObject["loại_giấy_chứng_nhận"],
      số_giấy_chứng_nhận: agreementObject["số_giấy_chứng_nhận"],
      ngày_cấp_giấy_chứng_nhận: dayjs(
        agreementObject["ngày_cấp_giấy_chứng_nhận"]
      ).format("DD/MM/YYYY"),
      nơi_cấp_giấy_chứng_nhận: agreementObject["nơi_cấp_giấy_chứng_nhận"],
      đặc_điểm_thửa_đất: {
        diện_tích: {
          số: agreementObject["diện_tích"],
        },
        mục_đích_và_thời_hạn_sử_dụng: agreementObject[
          "mục_đích_và_thời_hạn_sử_dụng"
        ]?.map((item) => ({
          phân_loại: item["phân_loại"],
          diện_tích: item["diện_tích"] || agreementObject["diện_tích"],
        })),
        nguồn_gốc_sử_dụng: agreementObject["nguồn_gốc_sử_dụng"],
      },
      số_tiền: agreementObject["giá_tiền"],
      ngày_lập_hợp_đồng: dayjs().format("DD/MM/YYYY").toString(),
      ngày_chứng_thực: dayjs().format("DD/MM/YYYY").toString(),
      ...extractAddress(agreementObject["địa_chỉ_mới"]),
    };

    return payload;
  };

  const handleGenerateToKhaiChung = () => {
    const payload = getPayloadToKhaiChung();
    setOpenDialog(false);
    setIsGenerating(true);
    if (isTangCho) {
      render_khai_thue_tang_cho_dat_va_dat_nong_nghiep_toan_bo(payload)
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "to-khai-chung.docx";
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
        });
    } else {
      render_khai_thue_chuyen_nhuong_dat_va_dat_nong_nghiep(payload)
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "to-khai-chung.docx";
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
        <PartyEntity title="Bên B" side="partyB" />
        <ObjectEntity
          title="Đối tượng chuyển nhượng của hợp đồng"
          isTangCho={isTangCho}
        />
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
            disabled={!isFormValid}
            onClick={() => setOpenDialog(true)}
          >
            {isGenerating ? <CircularProgress size={20} /> : "Tạo hợp đồng"}
          </Button>
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
            disabled={!isFormValid}
            onClick={handleGenerateToKhaiChung}
          >
            {isGenerating ? <CircularProgress size={20} /> : "Khai thuế"}
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
