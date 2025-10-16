import { Box, Button, Typography } from "@mui/material";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { SidebarMenu } from "../common/sidebar-menu";
import { SidebarMenuMobile } from "../common/side-bar-menu-mobile";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";

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

  const fullName = localStorage.getItem("username");
  const access_token = localStorage.getItem("access_token");

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!fullName || !access_token) {
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
        sx={{ height: { xs: "60px", md: "100px" } }}
      >
        <Typography sx={{ display: { xs: "none", md: "block" } }} variant="h3">
          Công chứng Trần Gia
        </Typography>
        <Box display="flex" alignItems="center" gap="1rem">
          <Link to="/profile" style={{ textDecoration: "none" }}>
            <Avatar sx={{ width: 50, height: 50, bgcolor: "#78C841" }} />
          </Link>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogOut}
            startIcon={<LogoutIcon />}
          >
            Đăng xuất
          </Button>
        </Box>
      </Box>
      <Box
        className="content"
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "250px 1fr" }}
        sx={{ height: "calc(100vh - 100px)" }}
      >
        <Box height="100%" sx={{ display: { xs: "none", md: "block" } }}>
          <SidebarMenu />
        </Box>
        <Box flex={1} sx={{ p: { xs: "1rem", md: "2rem" } }}>
          <Outlet />
        </Box>
      </Box>
      <Box
        sx={{
          display: {
            xs: "block",
            md: "none",
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          },
        }}
      >
        <SidebarMenuMobile />
      </Box>
      <Box
        position="fixed"
        bottom="0"
        right="0"
        px="1rem"
        bgcolor="#F5F5F0"
        width="100%"
        sx={{
          borderRadius: "5px 5px 0 0",
          textAlign: "right",
          display: { xs: "none", md: "block" },
        }}
      >
        <Typography variant="caption">
          {formatBuildTime(__BUILD_TIME__)}
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
