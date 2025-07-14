import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  useTheme,
} from "@mui/material";
// import { HdcnQuyenSdDatProvider } from "@/context/hdcn-quyen-sd-dat-context";
import { PartyEntity } from "./components/party-entity";
import { ObjectEntity } from "./components/object";
import SearchIcon from "@mui/icons-material/Search";
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";
import axios from "axios";
import type { HDCNQuyenSDDatPayload } from "@/models/agreement-entity";

export const ChuyenNhuongDatToanBo = () => {
  const { partyA, partyB, agreementObjects } = useHdcnQuyenSdDatContext();
  const { palette } = useTheme();
  const handleGenerateDocument = () => {
    const couplesA = partyA["vợ chồng"].map((couple) => couple.chồng).concat(partyA["vợ chồng"].map((couple) => couple.vợ));
    const couplesB = partyB["vợ chồng"].map((couple) => couple.chồng).concat(partyB["vợ chồng"].map((couple) => couple.vợ));
    const payload: HDCNQuyenSDDatPayload = {
      "bên A": {
        "cá thể": [...partyA["cá nhân"], ...couplesA],
      },
      "bên B": {
        "cá thể": [...partyB["cá nhân"], ...couplesB],
      },
      "số thửa đất": agreementObjects[0].so_thua_dat,
      "tờ bản đồ": agreementObjects[0].to_ban_do_so,
      "địa chỉ cũ": agreementObjects[0].dia_chi,
      "địa chỉ mới": agreementObjects[0].dia_chi,
      "loại giấy chứng nhận": agreementObjects[0].loai_giay_to,
      "số giấy chứng nhận": agreementObjects[0].so_giay_to,
      "số vào sổ cấp giấy chứng nhận": agreementObjects[0].so_vao_so_cap_gcn,
      "ngày cấp giấy chứng nhận": agreementObjects[0].ngay_cap_giay_chung_nhan,
      "nơi cấp giấy chứng nhận": agreementObjects[0].noi_cap_giay_chung_nhan,
      "đặc điểm thửa đất": {
        "diện tích": agreementObjects[0].dien_tich,
        "diện tích bằng chữ": "mot tram met muong",
        "hình thức sử dụng": agreementObjects[0].hinh_thuc_su_dung,
        "mục đích và thời hạn sử dụng": [
          {
            "phân loại": "đất ở",
            "diện tích": agreementObjects[0].dien_tich,
            "thời hạn sử dụng": "vĩnh viễn",
          },
        ],
        "nguồn gốc sử dụng": agreementObjects[0].nguon_goc_su_dung,
        "ghi chú": agreementObjects[0].ghi_chu,
      },
      "số tiền": "1000000000",
      "số tiền bằng chữ": "một tỷ đồng",
    };
    axios
      .post(
        "https://0cc46ea5ff8b.ngrok-free.app/templates/hdcn-quyen-su-dung-dat/render",
        payload,
        {
          responseType: 'blob', // Important: tells axios to handle binary data
        }
      )
      .then((res) => {
        console.log(res);
        
        // Create a blob from the response data
        const blob = new Blob([res.data], { 
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        });
        
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'hop-dong-chuyen-nhuong-dat.docx'; // Set the filename
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error generating document:', error);
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
          sx={{ backgroundColor: palette.softTeal }}
          onClick={handleGenerateDocument}
        >
          Lưu
        </Button>
      </Box>
    </Box>
  );
};
