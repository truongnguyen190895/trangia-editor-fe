import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  FormControl,
  FormLabel,
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
      <Box display="flex" alignItems="center" gap="10px">
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/staff")}
        >
          <ArrowBackIcon />
        </Button>
        {user && user?.name ? (
          <Typography variant="h4">
            {user.name} - ({user?.branches[0]?.friendly_name})
          </Typography>
        ) : (
          <Typography variant="h4">Thêm nhân viên mới</Typography>
        )}
      </Box>
      <Box mt="3rem">
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)"
            gap="10px"
            border="1px solid #ccc"
            borderRadius="10px"
            padding="20px"
          >
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Tên nhân viên</FormLabel>
              <TextField
                name="name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name}
                value={values.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Tài khoản</FormLabel>
              <TextField
                name="username"
                fullWidth
                error={!!errors.username}
                helperText={errors.username}
                value={values.username}
                onChange={handleChange}
              />
            </FormControl>
            {!user ? (
              <FormControl sx={{ marginBottom: "10px" }}>
                <FormLabel>Mật khẩu</FormLabel>
                <TextField
                  name="password"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password}
                  value={values.password}
                  onChange={handleChange}
                />
              </FormControl>
            ) : null}

            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Chi nhánh</FormLabel>
              <Select
                name="branches"
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
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Chức vụ</FormLabel>
              <Select
                name="role"
                fullWidth
                value={values.role}
                onChange={handleChange}
              >
                <MenuItem value="User">Nhân viên</MenuItem>
                <MenuItem value="BranchManager">Phó/Trưởng bộ phận</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box className="form-action" display="flex" gap="10px" mt="2rem">
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ width: "100px" }}
            >
              {user ? "Cập nhật" : "Tạo mới"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/staff")}
              sx={{ width: "100px" }}
            >
              Hủy
            </Button>
          </Box>
        </form>
      </Box>
      <LoadingDialog open={loading} />
    </Box>
  );
};

export default AddEmployee;
