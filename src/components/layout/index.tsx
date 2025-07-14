import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { Outlet } from "react-router-dom";

const Layout = () => {
  // Format the build time for display
  const formatBuildTime = (buildTime: string) => {
    try {
      const date = new Date(buildTime);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <Box
      position="relative"
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Tran Gia</Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              ml: 'auto', 
              opacity: 0.7,
              fontSize: '0.75rem'
            }}
          >
            Deployed: {formatBuildTime(__BUILD_TIME__)}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
