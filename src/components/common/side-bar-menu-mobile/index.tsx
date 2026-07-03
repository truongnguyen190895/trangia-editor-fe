import { Box, Typography } from "@mui/material";
import { Description, Create, Timeline } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    text: "Soạn thảo",
    icon: <Create />,
    path: "/",
  },
  {
    text: "Phiếu thu",
    icon: <Description />,
    path: "/submit-contract",
  },
  {
    text: "Tổng hợp",
    icon: <Timeline />,
    path: "/history",
  },
];

export const SidebarMenuMobile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      bgcolor="background.paper"
      display="grid"
      alignItems="center"
      gridTemplateColumns="repeat(3, 1fr)"
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        pb: "env(safe-area-inset-bottom)",
      }}
    >
      {menuItems.map((item) => {
        const active = location.pathname === item.path;
        return (
          <Box
            key={item.text}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            onClick={() => handleItemClick(item.path)}
            sx={{
              py: 0.75,
              cursor: "pointer",
              color: active ? "primary.main" : "text.secondary",
            }}
          >
            {item.icon}
            <Typography
              sx={{ fontSize: "0.65rem", fontWeight: active ? 700 : 500 }}
            >
              {item.text}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};
