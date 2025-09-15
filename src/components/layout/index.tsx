import { Box, Button, Typography } from "@mui/material";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { SidebarMenu } from "../common/sidebar-menu";

const Layout = () => {
  const navigate = useNavigate();
  const formatBuildTime = (buildTime: string) => {
    try {
      const date = new Date(buildTime);
      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown";
    }
  };

  const userName = localStorage.getItem("username");
  const access_token = localStorage.getItem("access_token");

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!userName || !access_token) {
    return <Navigate to="/login" />;
  }

  return (
    <Box position="relative" className="layout-container">
      <Box
        className="navigator"
        bgcolor="#1C6EA4"
        color="#fff"
        display="flex"
        alignItems="center"
        px="1rem"
        justifyContent="space-between"
        sx={{ height: "100px" }}
      >
        <Typography variant="h3">Công chứng Trần Gia</Typography>
        <Box display="flex" alignItems="center" gap="1rem">
          <Typography variant="h5">Xin chào: {userName}</Typography>
          <Button variant="contained" color="error" onClick={handleLogOut}>
            Đăng xuất
          </Button>
          <Typography
            variant="caption"
            sx={{
              ml: "auto",
              opacity: 0.7,
              fontSize: "0.75rem",
            }}
          >
            Deployed: {formatBuildTime(__BUILD_TIME__)}
          </Typography>
        </Box>
      </Box>
      <Box
        className="content"
        display="grid"
        sx={{ height: "calc(100vh - 100px)", gridTemplateColumns: "300px 1fr" }}
      >
        <Box height="100%">
          <SidebarMenu />
        </Box>
        <Box flex={1} p="2rem">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
