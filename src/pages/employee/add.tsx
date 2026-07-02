import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Paper,
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { listBranches, type Branch } from "@/api/branchs";
import { createUser, getUser, type User, updateEmployee } from "@/api/users";
import { toast } from "react-toastify";
import { LoadingDialog } from "@/components/common/loading-dialog";
import { PageHeader } from "@/components/common/page-header";

interface AddEmployeeFormValues {
  name: string;
  username: string;
  password: string;
  role: string;
  branches: string;
}

const AddEmployee = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { username } = useParams();

  useEffect(() => {
    listBranches().then((res) => {
      setBranches(res);
    });
  }, []);

  const handleAddEmployee = (values: AddEmployeeFormValues) => {
    createUser({
      username: values.username,
      password: values.password,
      name: values.name,
      role: values.role,
      branches: [values.branches],
    })
      .then(() => {
        navigate("/staff");
        toast.success("Nhân viên đã được tạo thành công");
      })
      .catch((err) => {
        toast.error("Lỗi khi tạo nhân viên " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdateEmployee = (values: AddEmployeeFormValues) => {
    updateEmployee({
      username: values.username,
      name: values.name,
      role: values.role,
      branches: [values.branches],
    })
      .then(() => {
        navigate("/staff");
        toast.success("Nhân viên đã được cập nhật thành công");
      })
      .catch((err) => {
        toast.error("Lỗi khi cập nhật nhân viên " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const { values, errors, handleChange, handleSubmit, setValues } =
    useFormik<AddEmployeeFormValues>({
      initialValues: {
        name: "",
        username: "",
        password: "",
        role: "User",
        branches: "HĐ",
      },
      validationSchema: Yup.object({
        name: Yup.string().required("Tên nhân viên là bắt buộc"),
        username: Yup.string().required("Tài khoản nhân viên là bắt buộc"),
        password: Yup.string(),
        role: Yup.string().required("Chức vụ nhân viên là bắt buộc"),
        branches: Yup.string().required("Chi nhánh nhân viên là bắt buộc"),
      }),
      onSubmit: (values) => {
        setLoading(true);
        if (user) {
          handleUpdateEmployee(values);
        } else {
          handleAddEmployee(values);
        }
      },
    });

  useEffect(() => {
    if (username) {
      setLoading(true);
      getUser(username as string)
        .then((res) => {
          setUser(res);
          setValues({
            name: res.name,
            username: res.username,
            role: res.role,
            branches: res.branches[0]?.id || "HĐ",
            password: "",
          });
        })
        .catch((err) => {
          toast.error("Lỗi khi lấy thông tin nhân viên");
          console.error("error getting user", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [username, setValues]);

  return (
    <Box>
      <Box display="flex" alignItems="flex-start" gap={1.5}>
        <IconButton
          onClick={() => navigate("/staff")}
          aria-label="Quay lại"
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box flex={1} minWidth={0}>
          <PageHeader
            eyebrow="Nhân sự"
            title={
              user && user?.name
                ? `${user.name} - (${user?.branches[0]?.friendly_name})`
                : "Thêm nhân viên mới"
            }
          />
        </Box>
      </Box>
      <form onSubmit={handleSubmit}>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 2,
          }}
        >
          <TextField
            name="name"
            label="Tên nhân viên"
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
            value={values.name}
            onChange={handleChange}
          />
          <TextField
            name="username"
            label="Tài khoản"
            fullWidth
            error={!!errors.username}
            helperText={errors.username}
            value={values.username}
            onChange={handleChange}
          />
          {!user ? (
            <TextField
              name="password"
              label="Mật khẩu"
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
              value={values.password}
              onChange={handleChange}
            />
          ) : null}

          <FormControl fullWidth>
            <InputLabel id="branches-label">Chi nhánh</InputLabel>
            <Select
              name="branches"
              labelId="branches-label"
              label="Chi nhánh"
              fullWidth
              value={values.branches}
              onChange={handleChange}
            >
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.friendly_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="role-label">Chức vụ</InputLabel>
            <Select
              name="role"
              labelId="role-label"
              label="Chức vụ"
              fullWidth
              value={values.role}
              onChange={handleChange}
            >
              <MenuItem value="User">Nhân viên</MenuItem>
              <MenuItem value="BranchManager">Phó/Trưởng bộ phận</MenuItem>
            </Select>
          </FormControl>
        </Paper>
        <Box className="form-action" display="flex" gap={1.5} mt={3}>
          <Button type="submit" variant="contained">
            {user ? "Cập nhật" : "Tạo mới"}
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={() => navigate("/staff")}
          >
            Hủy
          </Button>
        </Box>
      </form>
      <LoadingDialog open={loading} />
    </Box>
  );
};

export default AddEmployee;
