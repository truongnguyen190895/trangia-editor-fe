import { Box } from "@mui/material";
import { Description, Create, Timeline } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    text: "Trình soạn thảo",
    icon: <Create fontSize="large" />,
    path: "/",
  },
  {
    text: "Phiếu thu",
    icon: <Description fontSize="large" />,
    path: "/submit-contract",
  },
  {
    text: "Tổng hợp",
    icon: <Timeline fontSize="large" />,
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
      bgcolor="#1C6EA4"
      height="50px"
      display="grid"
      alignItems="center"
      gridTemplateColumns="repeat(3, 1fr)"
    >
      {menuItems.map((item) => (
        <Box
          className={location.pathname === item.path ? "active" : ""}
          key={item.text}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => handleItemClick(item.path)}
          sx={{
            '&.active': {
              color: '#fff',
            },
          }}
        >
          <Box>{item.icon}</Box>
        </Box>
      ))}
    </Box>
  );
};
