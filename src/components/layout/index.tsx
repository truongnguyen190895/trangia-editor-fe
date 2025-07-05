import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Layout = () => {
  const navigate = useNavigate();

  return (
    <Box
      position="relative"
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Tran Gia</Typography>
        </Toolbar>
      </AppBar>
      <Box position="absolute" top="90px" left="20px">
        {location.pathname !== "/" && (
          <Button
            component="label"
            variant="contained"
            tabIndex={-1}
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
        )}
      </Box>
      <Container component="main" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
