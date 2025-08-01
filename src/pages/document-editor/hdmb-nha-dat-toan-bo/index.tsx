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
  HDMBNhaDatPayload,
  KhaiThueHDMBNhaDatToanBoPayload,
} from "@/models/hdmb-nha-dat";
import dayjs from "dayjs";
import {
  render_hdmb_nha_dat,
  render_khai_thue_hdmb_nha_dat_toan_bo,
  render_hdtc_nha_dat_toan_bo,
  render_uy_quyen_toan_bo_nha_dat,
} from "@/api";
import { extractAddress } from "@/utils/extract-address";
import { useHDMBNhaDatContext } from "@/context/hdmb-nha-dat";
import { translateDateToVietnamese } from "@/utils/date-to-words";
import { numberToVietnamese } from "@/utils/number-to-words";

interface Props {
  isTangCho?: boolean;
  isUyQuyen?: boolean;
}

export const HDMBNhaDatToanBo = ({
  isTangCho = false,
  isUyQuyen = false,
}: Props) => {
  const { partyA, partyB, agreementObject, nhaDat } = useHDMBNhaDatContext();
  const { palette } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [sốBảnGốc, setSốBảnGốc] = useState<number>(2);
  const [openDialog, setOpenDialog] = useState(false);
  const [isOutSide, setIsOutSide] = useState(false);

  const isFormValid =
    (partyA["cá_nhân"].length > 0 || partyA["vợ_chồng"].length > 0) &&
    (partyB["cá_nhân"].length > 0 || partyB["vợ_chồng"].length > 0) &&
    agreementObject !== null &&
    nhaDat !== null;

  const getPayload = (): HDMBNhaDatPayload => {
    if (isUyQuyen) {
      if (!agreementObject) {
        throw new Error("Nhà đất is null");
      }
    } else {
      if (!agreementObject || !nhaDat) {
        throw new Error("Agreement object or nha dat is null");
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
        ...extractAddress(couple.chồng["địa_chỉ_thường_trú"]),
      }))
      .concat(
        partyB["vợ_chồng"].map((couple) => ({
          ...couple.vợ,
          quan_hệ: "vợ",
          ngày_sinh: dayjs(couple.vợ["ngày_sinh"]).format("DD/MM/YYYY"),
          ngày_cấp: dayjs(couple.vợ["ngày_cấp"]).format("DD/MM/YYYY"),
          tình_trạng_hôn_nhân: null,
          ...extractAddress(couple.vợ["địa_chỉ_thường_trú"]),
        }))
      );

    const payload: HDMBNhaDatPayload = {
      bên_A: {
        cá_thể: [
          ...partyA["cá_nhân"].map((person) => ({
            ...person,
            ngày_sinh: dayjs(person["ngày_sinh"]).format("DD/MM/YYYY"),
            ngày_cấp: dayjs(person["ngày_cấp"]).format("DD/MM/YYYY"),
            tình_trạng_hôn_nhân: person["tình_trạng_hôn_nhân"] || null,
            tình_trạng_hôn_nhân_vợ_chồng: null,
            quan_hệ: person["quan_hệ"] || null,
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
            tình_trạng_hôn_nhân_vợ_chồng: null,
            quan_hệ: person["quan_hệ"] || null,
            ...extractAddress(person["địa_chỉ_thường_trú"]),
          })),
          ...couplesB,
        ],
      },
      ...agreementObject,
      ...nhaDat!,
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
      render_hdtc_nha_dat_toan_bo(payload)
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `Hợp đồng tặng cho nhà đất - ${payload["bên_A"]["cá_thể"][0]["tên"]} - ${payload["bên_B"]["cá_thể"][0]["tên"]}.docx`;
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
    } else if (isUyQuyen) {
      render_uy_quyen_toan_bo_nha_dat(payload)
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "UQ toàn bộ nhà + đất.docx";
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
      render_hdmb_nha_dat(payload)
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `Hợp đồng mua bán nhà đất - ${payload["bên_A"]["cá_thể"][0]["tên"]} - ${payload["bên_B"]["cá_thể"][0]["tên"]}.docx`;
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

  const getPayloadToKhaiChung = (): KhaiThueHDMBNhaDatToanBoPayload => {
    if (!agreementObject || !nhaDat) {
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

    const payload: KhaiThueHDMBNhaDatToanBoPayload = {
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
      số_giấy_chứng_nhận: agreementObject["số_gcn"],
      nơi_cấp_giấy_chứng_nhận: agreementObject["nơi_cấp_gcn"],
      ngày_cấp_giấy_chứng_nhận: agreementObject["ngày_cấp_gcn"],
      ngày_chứng_thực: null,
      ...extractAddress(agreementObject["địa_chỉ_nhà_đất"]),
      số_thửa_đất: agreementObject["số_thửa_đất"],
      số_tờ_bản_đồ: agreementObject["số_tờ_bản_đồ"],
      đặc_điểm_thửa_đất: {
        mục_đích_và_thời_hạn_sử_dụng: [
          {
            phân_loại: agreementObject["mục_đích_sở_hữu_đất"],
            diện_tích: agreementObject["diện_tích_đất_bằng_số"],
          },
        ],
        nguồn_gốc_sử_dụng: agreementObject["nguồn_gốc_sử_dụng_đất"],
        diện_tích: {
          số: agreementObject["diện_tích_đất_bằng_số"],
        },
      },
      số_tiền: nhaDat["số_tiền"],
      diện_tích_xây_dựng: nhaDat["diện_tích_xây_dựng"],
      diện_tích_sàn: nhaDat["diện_tích_sàn"],
      cấp_hạng: nhaDat["cấp_hạng"],
      nguồn_gốc_sử_dụng_đất: agreementObject["nguồn_gốc_sử_dụng_đất"],
      năm_hoàn_thành_xây_dựng: nhaDat["năm_hoàn_thành_xây_dựng"],
      loại_nhà_ở: nhaDat["loại_nhà_ở"],
    };

    return payload;
  };

  const handleKhaiThue = () => {
    const payload = getPayloadToKhaiChung();
    setOpenDialog(false);
    setIsGenerating(true);
    render_khai_thue_hdmb_nha_dat_toan_bo(payload)
      .then((res) => {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "khai-thue-hdmb-nha-dat-toan-bo.docx";
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
            // disabled={!isFormValid || !isUyQuyen}
            onClick={() => setOpenDialog(true)}
          >
            {isGenerating ? (
              <CircularProgress size={20} />
            ) : (
              `Tạo hợp đồng ${isUyQuyen ? "uỷ quyền" : ""}`
            )}
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
              disabled={!isFormValid || isTangCho}
              onClick={handleKhaiThue}
            >
              {isGenerating ? <CircularProgress size={20} /> : "Khai thuế"}
            </Button>
          ) : (
            <></>
          )}
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
