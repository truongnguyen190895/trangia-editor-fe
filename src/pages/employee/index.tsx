import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
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
  Pagination,
  IconButton,
} from "@mui/material";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { PageHeader } from "@/components/common/page-header";
import { listUsers, type User, toggleUserActive } from "@/api/users";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { toast } from "react-toastify";
import { LoadingDialog } from "@/components/common/loading-dialog";
import ClearIcon from "@mui/icons-material/Clear";

const DEBOUNCE_TIME = 500;

const Employee = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [debounceSearch, setDebounceSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [openWarningDialog, setOpenWarningDialog] = useState<boolean>(false);
  const [userToToggleActive, setUserToToggleActive] = useState<User | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    listUsers({
      employee: true,
      search: debounceSearch,
      page: page - 1,
      size: 50,
    })
      .then((res) => {
        setUsers(res.content);
        setTotalPages(res.page.total_pages);
        setTotalElements(res.page.total_elements);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debounceSearch, page]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceSearch(search);
      setPage(1);
    }, DEBOUNCE_TIME);
    return () => clearTimeout(timeout);
  }, [search]);

  const getUserStatus = (active: boolean) => {
    return active ? (
      <Chip
        label="Đang hoạt động"
        color="success"
        size="small"
        variant="outlined"
      />
    ) : (
      <Chip
        label="Không hoạt động"
        color="warning"
        size="small"
        variant="outlined"
      />
    );
  };

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const getUserRole = (role: string) => {
    switch (role) {
      case "Admin":
        return <Chip label="Quản trị viên" size="small" variant="outlined" />;
      case "User":
        return <Chip label="Nhân viên" size="small" variant="outlined" />;
      case "BranchManager":
        return (
          <Chip label="Phó/Trưởng bộ phận" size="small" variant="outlined" />
        );
      default:
        return <Chip label="Nhân viên" size="small" variant="outlined" />;
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
      <PageHeader
        eyebrow="Nhân sự"
        title={`Danh sách nhân viên (${totalElements})`}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/staff/add")}
          >
            Thêm nhân viên
          </Button>
        }
      />
      <Box>
        <TextField
          label="Tìm kiếm"
          placeholder="Tìm kiếm nhân viên"
          value={search}
          sx={{ width: "400px", maxWidth: "100%" }}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearch("")}>
                    <ClearIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
      </Box>
      {users.length > 0 ? (
        <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
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
                      cursor: user?.active ? "pointer" : "not-allowed",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                    onClick={() =>
                      user?.active
                        ? navigate(`/staff/edit/${user.username}`)
                        : undefined
                    }
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
                        size="small"
                        color={user?.active ? "error" : "success"}
                        endIcon={user?.active ? <StopIcon /> : <PlayArrowIcon />}
                        onClick={(e) => handleOpenWarning(e, user)}
                      >
                        {user?.active ? "Ngừng hoạt động" : "Kích hoạt"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            className="pagination-container"
            display="flex"
            justifyContent="center"
            mt={2}
          >
            <Pagination
              count={totalPages}
              page={page}
              shape="rounded"
              onChange={handleChangePage}
            />
          </Box>
        </Paper>
      ) : (
        <Box py="2rem">
          <Typography variant="h6" sx={{ fontStyle: "italic" }}>
            Không có kết quả
          </Typography>
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
