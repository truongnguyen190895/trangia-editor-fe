import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { listUsers, type User, toggleUserActive } from "@/api/users";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { toast } from "react-toastify";
import { LoadingDialog } from "@/components/common/loading-dialog";

const DEBOUNCE_TIME = 500;

const Employee = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [debounceSearch, setDebounceSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openWarningDialog, setOpenWarningDialog] = useState<boolean>(false);
  const [userToToggleActive, setUserToToggleActive] = useState<User | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    listUsers({ employee: true, search: debounceSearch })
      .then((res) => {
        setUsers(res.content);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debounceSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceSearch(search);
    }, DEBOUNCE_TIME);
    return () => clearTimeout(timeout);
  }, [search]);

  const getUserStatus = (active: boolean) => {
    return active ? (
      <Chip label="Hoạt động" color="success" />
    ) : (
      <Chip label="Không hoạt động" color="error" />
    );
  };

  const getUserRole = (role: string) => {
    switch (role) {
      case "Admin":
        return <Chip label="Quản trị viên" color="primary" />;
      case "User":
        return <Chip label="Nhân viên" color="secondary" />;
      case "BranchManager":
        return <Chip label="Phó/Trưởng bộ phận" color="info" />;
      default:
        return <Chip label="Nhân viên" color="secondary" />;
    }
  };

  const handleToggleActive = (user: User) => {
    setLoading(true);
    toggleUserActive(user.username, !user.active)
      .then(() => {
        toast.success("Trạng thái nhân viên đã được cập nhật thành công");
        listUsers({ employee: true, search }).then((res) => {
          setUsers(res.content);
        });
      })
      .catch((err) => {
        toast.error("Lỗi khi cập nhật trạng thái nhân viên " + err.message);
      })
      .finally(() => {
        setLoading(false);
        setOpenWarningDialog(false);
        setUserToToggleActive(null);
      });
  };

  const handleOpenWarning = (
    e: React.MouseEvent<HTMLButtonElement>,
    user: User
  ) => {
    e.stopPropagation();
    setUserToToggleActive(user);
    setOpenWarningDialog(true);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Danh sách nhân viên</Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => navigate("/staff/add")}
        >
          Thêm nhân viên
        </Button>
      </Box>
      <Box mt="2rem">
        <TextField
          label="Tìm kiếm"
          placeholder="Tìm kiếm nhân viên"
          value={search}
          sx={{ width: "400px" }}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
      {users.length > 0 ? (
        <TableContainer sx={{ mt: "1rem" }}>
          <Table sx={{ borderCollapse: "separate", borderSpacing: "0 10px" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#D1D3D4" }}>
                <TableCell>Tên</TableCell>
                <TableCell>Chức vụ</TableCell>
                <TableCell>Tài khoản</TableCell>
                <TableCell>Chi nhánh</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.username}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                      transition: "scale 0.3s ease",
                      "& .MuiTableCell-root": {
                        backgroundColor: "#f0f0f0",
                      },
                    },
                  }}
                  onClick={() => navigate(`/staff/edit/${user.username}`)}
                >
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{getUserRole(user.role)}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    {user.branches.map((branch) => branch.id).join(", ")}
                  </TableCell>
                  <TableCell>{getUserStatus(user.active)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color={user?.active ? "error" : "success"}
                      onClick={(e) => handleOpenWarning(e, user)}
                    >
                      {user?.active ? "Ngừng hoạt động" : "Kích hoạt"}
                      {user?.active ? <StopIcon /> : <PlayArrowIcon />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box py="2rem">
          <Typography variant="h6" sx={{ fontStyle: "italic" }}>Không có kết quả</Typography>
        </Box>
      )}

      <ConfirmationDialog
        open={openWarningDialog}
        title="Xác nhận"
        confirmText="Xác nhận"
        cancelText="Hủy"
        message="Bạn có chắc chắn muốn thay đổi trạng thái nhân viên này?"
        onConfirm={() => handleToggleActive(userToToggleActive!)}
        onCancel={() => {
          setOpenWarningDialog(false);
          setUserToToggleActive(null);
        }}
      />
      <LoadingDialog open={loading} />
    </Box>
  );
};

export default Employee;
