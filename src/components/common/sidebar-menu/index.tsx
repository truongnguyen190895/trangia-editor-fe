import React from "react";
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
import {
  Description,
  AccountBalance,
  Create,
  Timeline
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarMenuProps {
  open?: boolean;
  width?: number | string;
}

const menuItems = [
  {
    text: "Trình soạn thảo",
    icon: <Create />,
    path: "/",
  },
  {
    text: "Lấy số hợp đồng",
    icon: <Description />,
    path: "/submit-contract",
  },
  {
    text: "Lịch sử hợp đồng",
    icon: <Timeline />,
    path: "/history",
  },
  {
    text: "Kế toán",
    icon: <AccountBalance />,
    path: "/accounting",
  },
];

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  open = true,
  width = 240,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        width: open ? width : 0,
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
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleItemClick(item.path)}
              selected={location.pathname === item.path}
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
        ))}
      </List>
    </Box>
  );
};
