import { Box, Typography, ListItem, ListItemText, List } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const WarningBanner = () => {
  return (
    <Box
      className="warning-container"
      mt="2rem"
      border="3px solid #EDA35A"
      borderRadius="5px"
      padding="1rem"
      bgcolor="#EDA35A"
    >
      <Box display="flex" alignItems="center" gap="10px">
        <Typography variant="h6">Lưu ý</Typography>
        <ErrorOutlineIcon sx={{ color: "red" }} />
      </Box>
      <List>
        <ListItem>
          <ListItemText>
            - Số tiền nhập theo dạng rút gọn, ví dụ: 500 = 500,000
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            - Nhập số Hợp Đồng theo đúng theo quy định (ĐỐI VỚI SỐ CÔNG CHỨNG :
            ......./3.3, ĐỐI VỚI SỐ CHỮ KÝ: ......2025)
          </ListItemText>
        </ListItem>
      </List>
    </Box>
  );
};
