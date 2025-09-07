import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "@/api/auth";
import LoginBGImage from "@/assets/images/login-bg-image.jpg";

export const LoginPage = () => {
  const [account, setAccount] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    setError("");
    e.preventDefault();
    try {
      const response = await login({ username: account, password });
      localStorage.setItem("access_token", response.accessToken);
      localStorage.setItem("username", response.user.name);
      localStorage.setItem("roles", JSON.stringify(response.authorities));
      navigate("/");
    } catch (error) {
      setError("Tài khoản/Mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${LoginBGImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        py: "6rem",
        justifyContent: "center",
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ opacity: 0.85 }}>
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
              Đăng nhập
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="account"
                label="Tên tài khoản"
                name="account"
                autoComplete="account"
                autoFocus
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="Mật khẩu"
                name="password"
                type="password"
                autoComplete="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <Typography variant="body1" color="error">
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  height: "50px",
                  fontSize: "1.2rem",
                  backgroundColor: "green",
                }}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
