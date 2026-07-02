import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Description,
  Create,
  Timeline,
  People,
  Report,
} from "@mui/icons-material";
import HistoryIcon from "@mui/icons-material/History";
import { useNavigate, useLocation } from "react-router-dom";

declare const __BUILD_TIME__: string;

const menuItems = [
  {
    text: "Trình soạn thảo",
    icon: <Create />,
    path: "/",
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
  {
    text: "Báo cáo",
    icon: <Report />,
    path: "/report",
    adminRequired: false,
  },
  {
    text: "Báo cáo trưởng phó",
    icon: <Report />,
    path: "/report-branch-manager",
    adminRequired: false,
  },
];

const formatBuildTime = (buildTime: string) => {
  try {
    return new Date(buildTime).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

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
        overflow: "hidden",
        backgroundColor: "secondary.main",
        color: "rgba(255,255,255,0.72)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <List sx={{ p: 0, pt: 1, flex: 1 }}>
        {menuItems.map((item) => {
          if (item.adminRequired && !isAdmin) {
            return null;
          }
          const selected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleItemClick(item.path)}
                selected={selected}
                sx={{
                  minHeight: 44,
                  px: 2,
                  borderLeft: "3px solid transparent",
                  "&.Mui-selected": {
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderLeftColor: "primary.light",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.12)",
                    },
                    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                      color: "#fff",
                    },
                    "& .MuiListItemText-primary": {
                      fontWeight: 600,
                    },
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.06)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 1.5,
                    justifyContent: "center",
                    color: "inherit",
                    "& svg": { fontSize: "1.2rem" },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: "0.88rem" }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Typography
        variant="caption"
        sx={{
          p: 1.5,
          color: "rgba(255,255,255,0.4)",
          fontSize: "0.68rem",
        }}
      >
        Bản dựng {formatBuildTime(__BUILD_TIME__)}
      </Typography>
    </Box>
  );
};
