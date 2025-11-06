import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  useTheme,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { CircularProgress } from "@mui/material";
import type { HdDatCocPayload, GiayChungNhan } from "@/models/hd-dat-coc";
import { render_hd_dat_coc } from "@/api";
import { translateDateToVietnamese } from "@/utils/date-to-words";
import { numberToVietnamese } from "@/utils/number-to-words";
import { CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT } from "@/constants";
import { useThemChuTheContext } from "@/context/them-chu-the";
import { ThemChuThe } from "@/components/common/them-chu-the";
import { ThemLoiChungDialog } from "@/components/common/them-loi-chung-dialog";
import type { MetaData } from "@/components/common/them-loi-chung-dialog";
import { extractCoupleFromParty } from "@/utils/common";

const typeOptions = [
  {
    value: "đặt_cọc_đất",
    label: "Đặt cọc đất",
  },
  {
    value: "đặt_cọc_nhà_đất",
    label: "Đặt cọc nhà đất",
  },
  {
    value: "đặt_cọc_căn_hộ",
    label: "Đặt cọc căn hộ",
  },
  {
    value: "đặt_cọc_tài_sản",
    label: "Đặt cọc tài sản",
  },
];

interface AdditionalInfo {
  số_tiền_cọc: string;
  số_tiền_cọc_bằng_chữ: string;
  thời_hạn_cọc: string;
  thời_hạn_cọc_bằng_chữ: string;
  tiền_phạt_cọc: string;
  tiền_phạt_cọc_bằng_chữ: string;
}

interface Props {
  isChuaXoaChap: boolean;
}

export const NhomThueMuonDatCoc = ({ isChuaXoaChap }: Props) => {
  const { partyA, partyB } = useThemChuTheContext();
  const { palette } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [type, setType] = useState<string>("đặt_cọc_đất");
  const [giayChungNhan, setGiayChungNhan] = useState<GiayChungNhan>({
    loại_gcn: "",
    số_gcn: "",
    số_vào_sổ_cấp_gcn: "",
    nơi_cấp_gcn: "",
    ngày_cấp_gcn: "",
  });
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    số_tiền_cọc: "",
    số_tiền_cọc_bằng_chữ: "",
    thời_hạn_cọc: "",
    thời_hạn_cọc_bằng_chữ: "",
    tiền_phạt_cọc: "",
    tiền_phạt_cọc_bằng_chữ: "",
  });
  const [datCocDatForm, setDatCocDatForm] = useState<{
    số_thửa_đất: string;
    số_tờ_bản_đồ: string;
    địa_chỉ_hiển_thị: string;
  }>({
    số_thửa_đất: "",
    số_tờ_bản_đồ: "",
    địa_chỉ_hiển_thị: "",
  });
  const [datCocCanHoForm, setDatCocCanHoForm] = useState<{
    số_căn_hộ: string;
    tên_toà_nhà: string;
    địa_chỉ_hiển_thị: string;
  }>({
    số_căn_hộ: "",
    tên_toà_nhà: "",
    địa_chỉ_hiển_thị: "",
  });
  const [datCocTaiSanForm, setDatCocTaiSanForm] = useState<{
    tên_tài_sản: string;
    địa_chỉ_hiển_thị: string;
  }>({
    tên_tài_sản: "",
    địa_chỉ_hiển_thị: "",
  });

  const validatePayload = (): boolean => {
    return (
      (partyA["cá_nhân"].length > 0 || partyA["vợ_chồng"].length > 0) &&
      (partyB["cá_nhân"].length > 0 || partyB["vợ_chồng"].length > 0)
    );
  };

  const getPayload = (
    sốBảnGốc: number,
    isOutSide: boolean,
    côngChứngViên: string,
    ngày: string
  ): HdDatCocPayload => {
    const couplesA = extractCoupleFromParty(partyA);
    const couplesB = extractCoupleFromParty(partyB);

    const payload: HdDatCocPayload = {
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
      ngày: ngày,
      ngày_bằng_chữ: translateDateToVietnamese(ngày),
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
      công_chứng_viên: côngChứngViên,
      đặt_cọc_đất:
        type === "đặt_cọc_đất" ? { ...datCocDatForm, ...giayChungNhan } : null,
      đặt_cọc_nhà_đất:
        type === "đặt_cọc_nhà_đất"
          ? { ...datCocDatForm, ...giayChungNhan }
          : null,
      đặt_cọc_căn_hộ:
        type === "đặt_cọc_căn_hộ"
          ? { ...datCocCanHoForm, ...giayChungNhan }
          : null,
      đặt_cọc_tài_sản:
        type === "đặt_cọc_tài_sản"
          ? { ...datCocTaiSanForm, ...giayChungNhan }
          : null,
      ...additionalInfo,
    };

    return payload;
  };

  const handleGenerateDocument = (metaData: MetaData) => {
    const payload = getPayload(
      metaData.sốBảnGốc,
      metaData.isOutSide,
      metaData.côngChứngViên,
      metaData.ngày
    );
    setOpenDialog(false);
    setIsGenerating(true);
    render_hd_dat_coc(payload, isChuaXoaChap)
      .then((res) => {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = isChuaXoaChap
          ? "HD Dat-coc chưa xoá chấp.docx"
          : "HD Dat-coc.docx";
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

  const resetForm = () => {
    setDatCocDatForm({
      số_thửa_đất: "",
      số_tờ_bản_đồ: "",
      địa_chỉ_hiển_thị: "",
    });
    setDatCocCanHoForm({
      số_căn_hộ: "",
      tên_toà_nhà: "",
      địa_chỉ_hiển_thị: "",
    });
    setDatCocTaiSanForm({
      tên_tài_sản: "",
      địa_chỉ_hiển_thị: "",
    });
  };

  const handleChangeType = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetForm();
    setType(e.target.value as string);
  };

  const renderForm = () => {
    switch (type) {
      case "đặt_cọc_đất":
      case "đặt_cọc_nhà_đất":
        return (
          <Box
            className="dat-coc-dat-hoac-nha-dat-container"
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)"
            gap="1rem"
          >
            <TextField
              label="Số thửa đất"
              value={datCocDatForm.số_thửa_đất}
              onChange={(e) =>
                setDatCocDatForm({
                  ...datCocDatForm,
                  số_thửa_đất: e.target.value,
                })
              }
            />
            <TextField
              label="Số tờ bản đồ"
              value={datCocDatForm.số_tờ_bản_đồ}
              onChange={(e) =>
                setDatCocDatForm({
                  ...datCocDatForm,
                  số_tờ_bản_đồ: e.target.value,
                })
              }
            />
            <TextField
              label="Địa chỉ"
              value={datCocDatForm.địa_chỉ_hiển_thị}
              onChange={(e) =>
                setDatCocDatForm({
                  ...datCocDatForm,
                  địa_chỉ_hiển_thị: e.target.value,
                })
              }
            />
          </Box>
        );
      case "đặt_cọc_căn_hộ":
        return (
          <Box
            className="dat-coc-can-ho-container"
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)"
            gap="1rem"
          >
            <TextField
              label="Số căn hộ"
              value={datCocCanHoForm.số_căn_hộ}
              onChange={(e) =>
                setDatCocCanHoForm({
                  ...datCocCanHoForm,
                  số_căn_hộ: e.target.value,
                })
              }
            />
            <TextField
              label="Tên toà nhà"
              value={datCocCanHoForm.tên_toà_nhà}
              onChange={(e) =>
                setDatCocCanHoForm({
                  ...datCocCanHoForm,
                  tên_toà_nhà: e.target.value,
                })
              }
            />
            <TextField
              label="Địa chỉ"
              value={datCocCanHoForm.địa_chỉ_hiển_thị}
              onChange={(e) =>
                setDatCocCanHoForm({
                  ...datCocCanHoForm,
                  địa_chỉ_hiển_thị: e.target.value,
                })
              }
            />
          </Box>
        );
      case "đặt_cọc_tài_sản":
        return (
          <Box
            className="dat-coc-tai-san-container"
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)"
            gap="1rem"
          >
            <TextField
              label="Tên tài sản"
              value={datCocTaiSanForm.tên_tài_sản}
              onChange={(e) =>
                setDatCocTaiSanForm({
                  ...datCocTaiSanForm,
                  tên_tài_sản: e.target.value,
                })
              }
            />
            <TextField
              sx={{ gridColumn: "span 2" }}
              label="Địa chỉ"
              value={datCocTaiSanForm.địa_chỉ_hiển_thị}
              onChange={(e) =>
                setDatCocTaiSanForm({
                  ...datCocTaiSanForm,
                  địa_chỉ_hiển_thị: e.target.value,
                })
              }
            />
          </Box>
        );
      default:
        return <></>;
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
        <ThemChuThe title="Bên A" side="partyA" />
        <ThemChuThe title="Bên B" side="partyB" />
        <Box display="flex" gap="2rem">
          <Box flex={1}>
            <Typography variant="h6">Loại hợp đồng</Typography>
            <RadioGroup value={type} onChange={handleChangeType}>
              {typeOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </Box>
          <Box flex={4}>
            <Box>
              <Typography variant="h6">
                Thông tin đối tượng đặt cọc (
                {typeOptions.find((option) => option.value === type)?.label})
              </Typography>
              <Box py="1rem">{renderForm()}</Box>
            </Box>
            <Box mt="1rem">
              <Typography variant="h6">Thông tin giấy chứng nhận</Typography>
              <Box
                py="1rem"
                display="grid"
                gridTemplateColumns="repeat(3, 1fr)"
                gap="1rem"
              >
                <Autocomplete
                  sx={{ gridColumn: "span 2" }}
                  freeSolo
                  options={CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT}
                  value={
                    CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT.find(
                      (item) => item.value === giayChungNhan.loại_gcn
                    ) ?? null
                  }
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option?.label ?? ""
                  }
                  onChange={(_event, value) => {
                    setGiayChungNhan({
                      ...giayChungNhan,
                      loại_gcn:
                        typeof value === "string" ? value : value?.value ?? "",
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Loại giấy chứng nhận"
                      name="loại_giấy_chứng_nhận"
                      onChange={(e) => {
                        setGiayChungNhan({
                          ...giayChungNhan,
                          loại_gcn: e.target.value,
                        });
                      }}
                    />
                  )}
                />
                <TextField
                  label="Số giấy chứng nhận"
                  value={giayChungNhan.số_gcn}
                  onChange={(e) =>
                    setGiayChungNhan({
                      ...giayChungNhan,
                      số_gcn: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Số vào sổ"
                  value={giayChungNhan.số_vào_sổ_cấp_gcn}
                  onChange={(e) =>
                    setGiayChungNhan({
                      ...giayChungNhan,
                      số_vào_sổ_cấp_gcn: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Nơi cấp"
                  value={giayChungNhan.nơi_cấp_gcn}
                  onChange={(e) =>
                    setGiayChungNhan({
                      ...giayChungNhan,
                      nơi_cấp_gcn: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Ngày cấp"
                  value={giayChungNhan.ngày_cấp_gcn}
                  onChange={(e) =>
                    setGiayChungNhan({
                      ...giayChungNhan,
                      ngày_cấp_gcn: e.target.value,
                    })
                  }
                />
              </Box>
            </Box>
            <Box className="pricing-container" mt="1rem">
              <Typography variant="h6">Thông tin khác</Typography>
              <Box
                py="1rem"
                display="grid"
                gridTemplateColumns="repeat(3, 1fr)"
                gap="1rem"
              >
                <TextField
                  label="Số tiền cọc (VNĐ)"
                  value={additionalInfo.số_tiền_cọc}
                  helperText={`Bằng chữ: ${additionalInfo.số_tiền_cọc_bằng_chữ}`}
                  onChange={(e) =>
                    setAdditionalInfo({
                      ...additionalInfo,
                      số_tiền_cọc: e.target.value,
                      số_tiền_cọc_bằng_chữ: numberToVietnamese(
                        e.target.value?.replace(/\./g, "").replace(/\,/g, ".")
                      )?.toLocaleLowerCase(),
                    })
                  }
                />
                <TextField
                  label="Thời hạn cọc (năm)"
                  value={additionalInfo.thời_hạn_cọc}
                  onChange={(e) =>
                    setAdditionalInfo({
                      ...additionalInfo,
                      thời_hạn_cọc: e.target.value,
                      thời_hạn_cọc_bằng_chữ: numberToVietnamese(
                        e.target.value?.replace(/\./g, "").replace(/\,/g, ".")
                      )?.toLocaleLowerCase(),
                    })
                  }
                  helperText={`Bằng chữ: ${additionalInfo.thời_hạn_cọc_bằng_chữ}`}
                />
                <TextField
                  label="Tiền phạt cọc (VNĐ)"
                  value={additionalInfo.tiền_phạt_cọc}
                  onChange={(e) =>
                    setAdditionalInfo({
                      ...additionalInfo,
                      tiền_phạt_cọc: e.target.value,
                      tiền_phạt_cọc_bằng_chữ: numberToVietnamese(
                        e.target.value?.replace(/\./g, "").replace(/\,/g, ".")
                      )?.toLocaleLowerCase(),
                    })
                  }
                  helperText={`Bằng chữ: ${additionalInfo.tiền_phạt_cọc_bằng_chữ}`}
                />
              </Box>
            </Box>
          </Box>
        </Box>
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
      <ThemLoiChungDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        handleGenerateDocument={handleGenerateDocument}
      />
    </Box>
  );
};
