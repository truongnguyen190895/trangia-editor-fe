import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      px={2}
      bgcolor="background.default"
      textAlign="center"
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="body1" color="text.secondary">
        Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </Typography>
      <Button variant="contained" onClick={handleBackToHome}>
        Về trang chính
      </Button>
    </Box>
  );
};

export default NotFound;
