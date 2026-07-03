import { useState } from "react";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";
import type { User } from "@/api/users";
import { updateUser } from "@/api/users";
import { toast } from "react-toastify";
import { LoadingDialog } from "@/components/common/loading-dialog";
import { PageHeader } from "@/components/common/page-header";

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

  const getUserBranch = () => {
    if (user) {
      return user.branches[0].friendly_name;
    }
    return "";
  };
  return (
    <Box maxWidth={800} mx="auto">
      <PageHeader
        eyebrow={getUserBranch()}
        title={user.name || "Người dùng"}
      />
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Đổi mật khẩu
        </Typography>
        <Box
          component="form"
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 400,
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            label="Mật khẩu mới"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Xác nhận mật khẩu mới"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body1">
              {error}
            </Typography>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Button
              type="submit"
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
