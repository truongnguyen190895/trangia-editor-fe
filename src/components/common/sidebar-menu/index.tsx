import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { Description, Create, Timeline, People, CurrencyBitcoin } from "@mui/icons-material";
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    text: "Trình soạn thảo",
    icon: <Create />,
    path: "/",
    adminRequired: false,
  },
  {
    text: "Thừa kế",
    icon: <CurrencyBitcoin />,
    path: "/inheritance",
    adminRequired: false,
  },
  {
    text: "Lịch sử soạn thảo",
    icon: <HistoryIcon />,
    path: "/work-history",
    adminRequired: false,
  },
  {
    text: "Phiếu thu",
    icon: <Description />,
    path: "/submit-contract",
    adminRequired: false,
  },
  {
    text: "Tổng hợp",
    icon: <Timeline />,
    path: "/history",
    adminRequired: false,
  },
  {
    text: "Nhân sự",
    icon: <People />,
    path: "/staff",
    adminRequired: true,
  },
];

export const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const isAdmin = userInfo.is_admin || userInfo.role === "Manager";

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        flexShrink: 0,
        transition: "width 0.3s ease",
        overflow: "hidden",
        borderRight: "1px solid #e0e0e0",
        backgroundColor: "#f5f5f5",
        height: "100%",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Menu
        </Typography>
      </Box>
      <Divider />
      <List sx={{ p: 0 }}>
        {menuItems.map((item) => {
          if (item.adminRequired && !isAdmin) {
            return null;
          }
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleItemClick(item.path)}
                selected={location.pathname == item.path}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  "&.Mui-selected": {
                    backgroundColor: "#e3f2fd",
                    borderRight: "3px solid #1976d2",
                    "& .MuiListItemIcon-root": {
                      color: "#1976d2",
                    },
                    "& .MuiListItemText-primary": {
                      color: "#1976d2",
                      fontWeight: "medium",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 2,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
