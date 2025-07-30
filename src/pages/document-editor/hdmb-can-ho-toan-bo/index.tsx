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
import type {
  HDMBCanHoPayload,
  KhaiThueHDMBCanHoToanBoPayload,
} from "@/models/hdmb-can-ho";
import dayjs from "dayjs";
import {
  render_hdmb_can_ho,
  render_khai_thue_hdmb_can_ho_toan_bo,
  render_uy_quyen_toan_bo_can_ho,
} from "@/api";
import { extractAddress } from "@/utils/extract-address";
import { useHDMBCanHoContext } from "@/context/hdmb-can-ho";
import { translateDateToVietnamese } from "@/utils/date-to-words";
import { numberToVietnamese } from "@/utils/number-to-words";

interface Props {
  isUyQuyen?: boolean;
}

export const HDMBCanHoToanBo = ({ isUyQuyen }: Props) => {
  const { partyA, partyB, agreementObject, canHo } = useHDMBCanHoContext();

  const { palette } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [sốBảnGốc, setSốBảnGốc] = useState<number>(2);
  const [openDialog, setOpenDialog] = useState(false);
  const [isOutSide, setIsOutSide] = useState(false);

  const isFormValid = isUyQuyen
    ? Boolean(canHo)
    : (partyA["cá_nhân"].length > 0 || partyA["vợ_chồng"].length > 0) &&
      (partyB["cá_nhân"].length > 0 || partyB["vợ_chồng"].length > 0) &&
      agreementObject !== null &&
      canHo !== null;

  const getPayload = (): HDMBCanHoPayload => {
    if (isUyQuyen) {
      if (!canHo) {
        throw new Error("Can ho is null");
      }
    } else {
      if (!agreementObject || !canHo) {
        throw new Error("Agreement object or can ho is null");
      }
    }

    const couplesA = partyA["vợ_chồng"]
      .map((couple) => ({
        ...couple.chồng,
        ngày_sinh: dayjs(couple.chồng["ngày_sinh"]).format("DD/MM/YYYY"),
        ngày_cấp: dayjs(couple.chồng["ngày_cấp"]).format("DD/MM/YYYY"),
        tình_trạng_hôn_nhân: null,
        tình_trạng_hôn_nhân_vợ_chồng:
          couple.chồng["tình_trạng_hôn_nhân_vợ_chồng"],
        ...extractAddress(couple.chồng["địa_chỉ_thường_trú"]),
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
          ...extractAddress(couple.vợ["địa_chỉ_thường_trú"]),
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
        ...extractAddress(couple.chồng["địa_chỉ_thường_trú"]),
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
          ...extractAddress(couple.vợ["địa_chỉ_thường_trú"]),
        }))
      );

    const payload: HDMBCanHoPayload = {
      bên_A: {
        cá_thể: [
          ...partyA["cá_nhân"].map((person) => ({
            ...person,
            ngày_sinh: dayjs(person["ngày_sinh"]).format("DD/MM/YYYY"),
            ngày_cấp: dayjs(person["ngày_cấp"]).format("DD/MM/YYYY"),
            tình_trạng_hôn_nhân: person["tình_trạng_hôn_nhân"] || null,
            quan_hệ: person["quan_hệ"] || null,
            tình_trạng_hôn_nhân_vợ_chồng: null,
            ...extractAddress(person["địa_chỉ_thường_trú"]),
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
            ...extractAddress(person["địa_chỉ_thường_trú"]),
          })),
          ...couplesB,
        ],
      },
      số_căn_hộ: canHo["số_căn_hộ"],
      tên_toà_nhà: canHo["tên_toà_nhà"],
      địa_chỉ_toà_nhà: canHo["địa_chỉ_toà_nhà"],
      loại_gcn: canHo["loại_gcn"],
      số_gcn: canHo["số_gcn"],
      số_vào_sổ_cấp_gcn: canHo["số_vào_sổ_cấp_gcn"],
      nơi_cấp_gcn: canHo["nơi_cấp_gcn"],
      ngày_cấp_gcn: canHo["ngày_cấp_gcn"],
      diện_tích_sàn_bằng_số: canHo["diện_tích_sàn_bằng_số"],
      diện_tích_sàn_bằng_chữ: canHo["diện_tích_sàn_bằng_chữ"],
      cấp_hạng: canHo["cấp_hạng"],
      tầng_có_căn_hộ: canHo["tầng_có_căn_hộ"],
      kết_cấu: canHo["kết_cấu"],
      hình_thức_sở_hữu_căn_hộ: canHo["hình_thức_sở_hữu_căn_hộ"],
      năm_hoàn_thành_xây_dựng: canHo["năm_hoàn_thành_xây_dựng"],
      ghi_chú_căn_hộ: canHo["ghi_chú_căn_hộ"],
      giá_căn_hộ_bằng_số: canHo["giá_căn_hộ_bằng_số"],
      giá_căn_hộ_bằng_chữ: canHo["giá_căn_hộ_bằng_chữ"],
      số_thửa_đất: agreementObject?.["số_thửa_đất"] ?? "",
      số_tờ_bản_đồ: agreementObject?.["số_tờ_bản_đồ"] ?? "",
      diện_tích_đất_bằng_số: agreementObject?.["diện_tích_đất_bằng_số"] ?? "",
      diện_tích_đất_bằng_chữ: agreementObject?.["diện_tích_đất_bằng_chữ"] ?? "",
      hình_thức_sở_hữu_đất: agreementObject?.["hình_thức_sở_hữu_đất"] ?? "",
      mục_đích_sở_hữu_đất: agreementObject?.["mục_đích_sở_hữu_đất"] ?? "",
      thời_hạn_sử_dụng_đất: agreementObject?.["thời_hạn_sử_dụng_đất"] ?? "",
      nguồn_gốc_sử_dụng_đất: agreementObject?.["nguồn_gốc_sử_dụng_đất"] ?? "",
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
      thời_hạn: canHo?.["thời_hạn"] ?? null,
      thời_hạn_bằng_chữ: canHo?.["thời_hạn_bằng_chữ"] ?? null,
    };

    return payload;
  };

  const handleGenerateDocument = () => {
    const payload = getPayload();
    setOpenDialog(false);
    setIsGenerating(true);
    if (isUyQuyen) {
      render_uy_quyen_toan_bo_can_ho(payload)
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "HD uỷ quyền toàn bộ căn hộ.docx";
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
      render_hdmb_can_ho(payload)
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `Hợp đồng mua bán căn hộ - ${payload["bên_A"]["cá_thể"][0]["tên"]} - ${payload["bên_B"]["cá_thể"][0]["tên"]}.docx`;
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

  const getPayloadKhaiThue = (): KhaiThueHDMBCanHoToanBoPayload => {
    if (!agreementObject || !canHo) {
      throw new Error("Agreement object is null");
    }

    const couplesA = partyA["vợ_chồng"]
      .map((couple) => ({
        ...couple.chồng,
        ngày_sinh: dayjs(couple.chồng["ngày_sinh"]).format("DD/MM/YYYY"),
        ngày_cấp: dayjs(couple.chồng["ngày_cấp"]).format("DD/MM/YYYY"),
        tình_trạng_hôn_nhân: null,
        quan_hệ: null,
        thành_phố:
          couple.chồng["địa_chỉ_thường_trú"]?.split(",")[2]?.trim() || null,
        phường:
          couple.chồng["địa_chỉ_thường_trú"]?.split(",")[1]?.trim() || null,
        thôn: couple.chồng["địa_chỉ_thường_trú"]?.split(",")[0]?.trim() || null,
      }))
      .concat(
        partyA["vợ_chồng"].map((couple) => ({
          ...couple.vợ,
          quan_hệ: null,
          ngày_sinh: dayjs(couple.vợ["ngày_sinh"]).format("DD/MM/YYYY"),
          ngày_cấp: dayjs(couple.vợ["ngày_cấp"]).format("DD/MM/YYYY"),
          tình_trạng_hôn_nhân: null,
          thành_phố:
            couple.vợ["địa_chỉ_thường_trú"]?.split(",")[2]?.trim() || null,
          phường:
            couple.vợ["địa_chỉ_thường_trú"]?.split(",")[1]?.trim() || null,
          thôn: couple.vợ["địa_chỉ_thường_trú"]?.split(",")[0]?.trim() || null,
        }))
      );
    const couplesB = partyB["vợ_chồng"]
      .map((couple) => ({
        ...couple.chồng,
        ngày_sinh: dayjs(couple.chồng["ngày_sinh"]).format("DD/MM/YYYY"),
        ngày_cấp: dayjs(couple.chồng["ngày_cấp"]).format("DD/MM/YYYY"),
        tình_trạng_hôn_nhân: null,
        thành_phố:
          couple.chồng["địa_chỉ_thường_trú"]?.split(",")[2]?.trim() || null,
        phường:
          couple.chồng["địa_chỉ_thường_trú"]?.split(",")[1]?.trim() || null,
        thôn: couple.chồng["địa_chỉ_thường_trú"]?.split(",")[0]?.trim() || null,
      }))
      .concat(
        partyB["vợ_chồng"].map((couple) => ({
          ...couple.vợ,
          quan_hệ: null,
          ngày_sinh: dayjs(couple.vợ["ngày_sinh"]).format("DD/MM/YYYY"),
          ngày_cấp: dayjs(couple.vợ["ngày_cấp"]).format("DD/MM/YYYY"),
          tình_trạng_hôn_nhân: null,
          thành_phố:
            couple.vợ["địa_chỉ_thường_trú"]?.split(",")[2]?.trim() || null,
          phường:
            couple.vợ["địa_chỉ_thường_trú"]?.split(",")[1]?.trim() || null,
          thôn: couple.vợ["địa_chỉ_thường_trú"]?.split(",")[0]?.trim() || null,
        }))
      );

    const các_cá_thể_bên_A = [
      ...partyA["cá_nhân"].map((person) => ({
        ...person,
        ngày_sinh: dayjs(person["ngày_sinh"]).format("DD/MM/YYYY"),
        ngày_cấp: dayjs(person["ngày_cấp"]).format("DD/MM/YYYY"),
        tình_trạng_hôn_nhân: person["tình_trạng_hôn_nhân"] || null,
        thành_phố: person["địa_chỉ_thường_trú"]?.split(",")[2]?.trim() || null,
        phường: person["địa_chỉ_thường_trú"]?.split(",")[1]?.trim() || null,
        thôn: person["địa_chỉ_thường_trú"]?.split(",")[0]?.trim() || null,
      })),
      ...couplesA,
    ];
    const các_cá_thể_bên_B = [
      ...partyB["cá_nhân"].map((person) => ({
        ...person,
        ngày_sinh: dayjs(person["ngày_sinh"]).format("DD/MM/YYYY"),
        ngày_cấp: dayjs(person["ngày_cấp"]).format("DD/MM/YYYY"),
        tình_trạng_hôn_nhân: person["tình_trạng_hôn_nhân"] || null,
        thành_phố: person["địa_chỉ_thường_trú"]?.split(",")[2]?.trim() || null,
        phường: person["địa_chỉ_thường_trú"]?.split(",")[1]?.trim() || null,
        thôn: person["địa_chỉ_thường_trú"]?.split(",")[0]?.trim() || null,
      })),
      ...couplesB,
    ];

    const payload: KhaiThueHDMBCanHoToanBoPayload = {
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
      số_tờ_bản_đồ: agreementObject["số_tờ_bản_đồ"] || "",
      loại_giấy_tờ: canHo["loại_gcn"],
      số_giấy_chứng_nhận: canHo["số_gcn"],
      ngày_cấp_giấy_chứng_nhận: canHo["ngày_cấp_gcn"],
      nơi_cấp_giấy_chứng_nhận: canHo["nơi_cấp_gcn"],
      đặc_điểm_thửa_đất: {
        diện_tích: {
          số: canHo["diện_tích_sàn_bằng_số"],
        },
        mục_đích_và_thời_hạn_sử_dụng: [],
        nguồn_gốc_sử_dụng: agreementObject["nguồn_gốc_sử_dụng_đất"],
      },
      số_tiền: canHo["giá_căn_hộ_bằng_số"],
      ngày_lập_hợp_đồng: dayjs().format("DD/MM/YYYY").toString(),
      ngày_chứng_thực: dayjs().format("DD/MM/YYYY").toString(),
      diện_tích_sàn_bằng_số: canHo["diện_tích_sàn_bằng_số"],
      kết_cấu: canHo["kết_cấu"],
      tầng_có_căn_hộ: canHo["tầng_có_căn_hộ"],
      năm_hoàn_thành_xây_dựng: canHo["năm_hoàn_thành_xây_dựng"],
      cấp_hạng: canHo["cấp_hạng"],
      ...extractAddress(canHo["địa_chỉ_toà_nhà"]),
    };

    return payload;
  };

  const handleGenerateKhaiThue = () => {
    const payload = getPayloadKhaiThue();

    setOpenDialog(false);
    setIsGenerating(true);
    render_khai_thue_hdmb_can_ho_toan_bo(payload)
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
        <ObjectEntity title="Đối tượng của hợp đồng" isUyQuyen={isUyQuyen} />
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
            {isUyQuyen ? "Tạo hợp đồng uỷ quyền" : "Tạo hợp đồng"}
          </Button>
          {!isUyQuyen ? (
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
              onClick={handleGenerateKhaiThue}
            >
              {isGenerating ? <CircularProgress size={20} /> : "Khai thuế"}
            </Button>
          ) : null}
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
            {isUyQuyen ? "Tạo hợp đồng uỷ quyền" : "Tạo hợp đồng"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
