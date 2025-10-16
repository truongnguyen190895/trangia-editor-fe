import { Box, ListItemIcon } from "@mui/material";
import { Description, Create, Timeline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    text: "Trình soạn thảo",
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

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      bgcolor="#1C6EA4"
      height="50px"
      display="flex"
      alignItems="center"
      justifyContent="space-around"
    >
      {menuItems.map((item) => (
        <Box
          key={item.text}
          onClick={() => handleItemClick(item.path)}
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
        </Box>
      ))}
    </Box>
  );
};
