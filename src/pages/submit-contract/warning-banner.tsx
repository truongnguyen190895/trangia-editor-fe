import { Alert, AlertTitle } from "@mui/material";

export const WarningBanner = () => {
  return (
    <Alert severity="warning" sx={{ mt: "2rem" }}>
      <AlertTitle>Lưu ý</AlertTitle>
      - Số tiền nhập theo dạng rút gọn, ví dụ: 500 = 500,000
      <br />- Nhập số Hợp Đồng theo đúng theo quy định (ĐỐI VỚI SỐ CÔNG CHỨNG :
      ......./3.3, ĐỐI VỚI SỐ CHỮ KÝ: ......2025)
    </Alert>
  );
};
