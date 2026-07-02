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
import { SERIF_FAMILY } from "@/theme";

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
      localStorage.setItem("user_info", JSON.stringify(response.user));
      navigate("/");
    } catch {
      setError("Tài khoản/Mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(150deg, #23303d 0%, #16232F 55%, #101a24 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: "3rem",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper elevation={8} sx={{ p: 4, width: "100%", borderRadius: 3 }}>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: SERIF_FAMILY,
                fontWeight: 700,
                fontSize: "1.1rem",
                mb: 2,
              }}
            >
              TG
            </Box>
            <Typography
              component="h1"
              sx={{ fontFamily: SERIF_FAMILY, fontWeight: 700, fontSize: "1.5rem" }}
            >
              Công chứng Trần Gia
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.72rem" }}
            >
              Hệ thống soạn thảo văn bản
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                size="medium"
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
                size="medium"
                id="password"
                label="Mật khẩu"
                name="password"
                type="password"
                autoComplete="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 1, height: "48px", fontSize: "1rem" }}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ mr: 1, color: "inherit" }} />
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
