import { Box, Typography, Button } from "@mui/material";
import { HdcnQuyenSdDatProvider } from "@/context/hdcn-quyen-sd-dat-context";
import { PartyEntity } from "./components/party-entity";
import { ObjectEntity } from "./components/object";

export const ChuyenNhuongDatToanBo = () => {
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
          <Typography variant="h6">Tìm kiếm thông tin người dùng</Typography>
          <Typography variant="body1">Coming soon</Typography>
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
            color="secondary"
            onClick={handleGenerateDocument}
          >
            Lưu
          </Button>
        </Box>
      </Box>
    </HdcnQuyenSdDatProvider>
  );
};
