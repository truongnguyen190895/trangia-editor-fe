import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NotFoundImage from "@/assets/images/not-found.jpg";

const NotFound = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <Box
      position="relative"
      height="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#FF9A00"
    >
      <img
        src={NotFoundImage}
        alt="Not found"
        style={{ width: "auto", height: "100%" }}
      />
      <Box sx={{ position: "absolute", top: "10rem" }}>
        <Button variant="contained" color="primary" onClick={handleBackToHome} sx={{ height: '70px', width: '350px', fontSize: '2rem' }}>
          Quay về trang chủ
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;
