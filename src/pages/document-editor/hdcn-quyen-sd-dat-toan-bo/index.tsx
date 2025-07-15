import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { PartyEntity } from "./components/party-entity";
import { ObjectEntity } from "./components/object";
import SearchIcon from "@mui/icons-material/Search";
import { CircularProgress } from "@mui/material";
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";
import type { HDCNQuyenSDDatPayload } from "@/models/agreement-entity";
import dayjs from "dayjs";
import { render_hdcn_quyen_sd_dat_toan_bo } from "@/api";

export const ChuyenNhuongDatToanBo = () => {
  const { partyA, partyB, agreementObjects } = useHdcnQuyenSdDatContext();
  const { palette } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);

  const getPayload = (): HDCNQuyenSDDatPayload => {
    const couplesA = partyA["vợ chồng"]
      .map((couple) => ({
        ...couple.chồng,
        "ngày sinh": dayjs(couple.chồng["ngày sinh"]).format("DD/MM/YYYY"),
        "ngày cấp": dayjs(couple.chồng["ngày cấp"]).format("DD/MM/YYYY"),
      }))
      .concat(
        partyA["vợ chồng"].map((couple) => ({
          ...couple.vợ,
          "quan hệ": "vợ",
          "ngày sinh": dayjs(couple.vợ["ngày sinh"]).format("DD/MM/YYYY"),
          "ngày cấp": dayjs(couple.vợ["ngày cấp"]).format("DD/MM/YYYY"),
        }))
      );
    const couplesB = partyB["vợ chồng"]
      .map((couple) => ({
        ...couple.chồng,
        "ngày sinh": dayjs(couple.chồng["ngày sinh"]).format("DD/MM/YYYY"),
        "ngày cấp": dayjs(couple.chồng["ngày cấp"]).format("DD/MM/YYYY"),
      }))
      .concat(
        partyB["vợ chồng"].map((couple) => ({
          ...couple.vợ,
          "quan hệ": "vợ",
          "ngày sinh": dayjs(couple.vợ["ngày sinh"]).format("DD/MM/YYYY"),
          "ngày cấp": dayjs(couple.vợ["ngày cấp"]).format("DD/MM/YYYY"),
        }))
      );
    const object = agreementObjects[0];

    const purposes = object["mục đích sử dụng"].split(";"); // eg: đất ở: 123m2; đất trồng cây: 200m2
    const expires = object["thời hạn sử dụng"].split(";"); // eg: đất ở: lâu dài; đất trồng cây: 60 năm

    const purposesArray = purposes.map((purpose, index) => {
      const [purposeName, purposeArea] = purpose.split(":");
      return {
        "phân loại": purposeName,
        "diện tích": purposeArea?.trim(),
        "thời hạn sử dụng": expires[index]?.split(":")[1]?.trim(),
      };
    });

    const payload: HDCNQuyenSDDatPayload = {
      "bên A": {
        "cá thể": [
          ...partyA["cá nhân"].map((person) => ({
            ...person,
            "ngày sinh": dayjs(person["ngày sinh"]).format("DD/MM/YYYY"),
            "ngày cấp": dayjs(person["ngày cấp"]).format("DD/MM/YYYY"),
          })),
          ...couplesA,
        ],
      },
      "bên B": {
        "cá thể": [
          ...partyB["cá nhân"].map((person) => ({
            ...person,
            "ngày sinh": dayjs(person["ngày sinh"]).format("DD/MM/YYYY"),
            "ngày cấp": dayjs(person["ngày cấp"]).format("DD/MM/YYYY"),
          })),
          ...couplesB,
        ],
      },
      "số thửa đất": object["số thửa đất"],
      "tờ bản đồ": object["tờ bản đồ"],
      "địa chỉ cũ": object["địa chỉ cũ"],
      "địa chỉ mới": object["địa chỉ mới"],
      "loại giấy chứng nhận": object["loại giấy chứng nhận"],
      "số giấy chứng nhận": object["số giấy chứng nhận"],
      "số vào sổ cấp giấy chứng nhận": object["số vào sổ cấp giấy chứng nhận"],
      "ngày cấp giấy chứng nhận": dayjs(
        object["ngày cấp giấy chứng nhận"]
      ).format("DD/MM/YYYY"),
      "nơi cấp giấy chứng nhận": object["nơi cấp giấy chứng nhận"],
      "đặc điểm thửa đất": {
        "diện tích": object["diện tích"],
        "diện tích bằng chữ": object["diện tích bằng chữ"],
        "hình thức sử dụng": object["hình thức sử dụng"],
        "mục đích và thời hạn sử dụng": purposesArray,
        "nguồn gốc sử dụng": object["nguồn gốc sử dụng"],
        "ghi chú": object["ghi chú"],
      },
      "số tiền": object["giá tiền"],
      "số tiền bằng chữ": object["giá tiền bằng chữ"],
    };

    return payload;
  };

  const handleGenerateDocument = () => {
    const payload = getPayload();
    setIsGenerating(true);
    render_hdcn_quyen_sd_dat_toan_bo(payload)
      .then((res) => {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "hop-dong-chuyen-nhuong-dat.docx";
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
        <PartyEntity title="Bên chuyển nhượng" side="partyA" />
        <PartyEntity title="Bên nhận chuyển nhượng" side="partyB" />
        <ObjectEntity title="Đối tượng chuyển nhượng của hợp đồng" />
        <Button
          variant="contained"
          sx={{
            backgroundColor: palette.softTeal,
            height: "50px",
            fontSize: "1.2rem",
            fontWeight: "600",
            textTransform: "uppercase",
          }}
          onClick={handleGenerateDocument}
        >
          {isGenerating ? (
            <CircularProgress size={20} />
          ) : (
            "Tạo hợp đồng"
          )}
        </Button>
      </Box>
    </Box>
  );
};
