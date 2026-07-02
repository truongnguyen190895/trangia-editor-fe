import { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { SidebarMenu } from "../common/sidebar-menu";
import { SidebarMenuMobile } from "../common/side-bar-menu-mobile";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import { getUser } from "@/api/users";
import { SERIF_FAMILY } from "@/theme";

const HEADER_HEIGHT = { xs: "56px", md: "64px" };

const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInforJson = localStorage.getItem("user_info");
    const userInfor = userInforJson ? JSON.parse(userInforJson) : null;

    if (userInfor) {
      getUser(userInfor.username).then((res) => {
        // get the latest user info
        localStorage.setItem("user_info", JSON.stringify(res));
      });
    }
  }, []);

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
        bgcolor="secondary.main"
        color="secondary.contrastText"
        display="flex"
        alignItems="center"
        px="1rem"
        justifyContent="space-between"
        sx={{ height: HEADER_HEIGHT }}
      >
        <Box display="flex" alignItems="baseline" gap="0.6rem">
          <Typography
            sx={{ fontFamily: SERIF_FAMILY, fontWeight: 700, fontSize: "1.25rem" }}
          >
            Công chứng Trần Gia
          </Typography>
          <Typography
            sx={{
              display: { xs: "none", md: "block" },
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.6,
            }}
          >
            Hệ thống soạn thảo văn bản
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="0.75rem">
          <Link to="/profile" style={{ textDecoration: "none" }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "primary.main",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              {fullName.trim().charAt(0).toUpperCase()}
            </Avatar>
          </Link>
          <Button
            variant="outlined"
            onClick={handleLogOut}
            startIcon={<LogoutIcon />}
            sx={{
              color: "#fff",
              borderColor: "rgba(255,255,255,0.35)",
              "&:hover": {
                borderColor: "#fff",
                backgroundColor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            Đăng xuất
          </Button>
        </Box>
      </Box>
      <Box
        className="content"
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "250px 1fr" }}
        sx={{
          height: {
            xs: `calc(100vh - ${HEADER_HEIGHT.xs})`,
            md: `calc(100vh - ${HEADER_HEIGHT.md})`,
          },
        }}
      >
        <Box height="100%" sx={{ display: { xs: "none", md: "block" } }}>
          <SidebarMenu />
        </Box>
        <Box
          flex={1}
          sx={{
            p: { xs: "1rem", md: "2rem" },
            overflowY: "auto",
            // leave room for the fixed bottom nav on mobile
            pb: { xs: "72px", md: "2rem" },
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <SidebarMenuMobile />
      </Box>
    </Box>
  );
};

export default Layout;
