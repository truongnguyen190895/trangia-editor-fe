import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { HdcnQuyenSdDatProvider } from "@/context/hdcn-quyen-sd-dat-context";
import { PartyEntity } from "./components/party-entity";
import { ObjectEntity } from "./components/object";
import SearchIcon from "@mui/icons-material/Search";

export const ChuyenNhuongDatToanBo = () => {
  const { palette } = useTheme();
  const handleGenerateDocument = () => {
    console.log("generate document");
  };

  return (
    <HdcnQuyenSdDatProvider>
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
    </HdcnQuyenSdDatProvider>
  );
};
