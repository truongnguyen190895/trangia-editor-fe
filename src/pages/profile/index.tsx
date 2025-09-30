import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Avatar,
  TextField,
  Button,
} from "@mui/material";
import type { User } from "@/api/users";
import { updateUser } from "@/api/users";
import { toast } from "react-toastify";
import { LoadingDialog } from "@/components/common/loading-dialog";

const ProfilePage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user_info") ?? "{}") as User;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu mới không khớp");
      return;
    }
    setError(null);
    setLoading(true);
    updateUser({ username: user.username, password: newPassword })
      .then(() => {
        toast.success(
          "Đổi mật khẩu thành công, vui lòng đăng nhập lại với mật khẩu mới"
        );
        localStorage.clear();
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Box maxWidth={800} mx="auto">
      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center" }}>
        <Avatar sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}>
          {user.name
            ? user.name.split(" ")[0].charAt(0) +
              user.name.split(" ")[1].charAt(0)
            : "U"}
        </Avatar>
        <Typography variant="h4" gutterBottom>
          {user.name || "Người dùng"}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Đổi mật khẩu
        </Typography>
        <Box
          mt="1rem"
          component="form"
          sx={{
            "& .form-control": {
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              alignItems: "center",
              justifyContent: "flex-start",
              "& .form-control-label": {
                justifySelf: "start",
              },
            },
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
          onSubmit={handleSubmit}
        >
          <Box className="form-control">
            <Typography className="form-control-label">Mật khẩu mới</Typography>
            <TextField
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Box>
          <Box className="form-control">
            <Typography className="form-control-label">
              Xác nhận mật khẩu mới
            </Typography>
            <TextField
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Box>
          {error && (
            <Typography color="error" variant="body1" textAlign="left">
              {error}
            </Typography>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Button
              type="submit"
              color="success"
              sx={{ width: "200px" }}
              variant="contained"
              disabled={loading || !newPassword || !confirmPassword}
            >
              Sửa
            </Button>
          </Box>
        </Box>
      </Paper>
      <LoadingDialog open={loading} />
    </Box>
  );
};

export default ProfilePage;
