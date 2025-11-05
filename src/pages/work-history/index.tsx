import {
  Box,
  Table,
  TableCell,
  TableRow,
  TableHead,
  Typography,
  TableBody,
} from "@mui/material";
import { listWorkHistory } from "@/api/contract";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { templates } from "@/database";
import { useNavigate } from "react-router-dom";

const WorkHistory = () => {
  const [workHistory, setWorkHistory] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    listWorkHistory().then((resp) => {
      setWorkHistory(resp.content);
    });
  }, []);

  const handleClick = (templatePath: string, id: string) => {
    const [group, subGroup] = templatePath.split("/");
    const filterByGroup = templates.filter(
      (template) => template.subCategory === group
    );
    const document = filterByGroup.find(
      (template) => template.path === subGroup
    );
    if (document) {
      navigate(
        `/editor?type=${document.type}&name=${document.path}&templateId=${document.templateId}&id=${id}`
      );
    }
  };

  return (
    <Box>
      <Typography variant="h3">Lịch sử soạn thảo</Typography>
      <Box
        py="4rem"
        bgcolor="#FFC50F"
        mt="2rem"
        borderRadius="1rem"
        height="300px"
      >
        <Typography textAlign="center" variant="h3">
          Functionality is under development
        </Typography>
        <Typography textAlign="center" variant="h5" mt="1rem">
          We will update this page soon
        </Typography>
      </Box>
      <Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ngày</TableCell>
              <TableCell>Tên</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workHistory.map((item) => (
              <TableRow
                key={item.id}
                onClick={() => handleClick(item.template, item.id)}
              >
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  {dayjs(item.audit.created_at).format("DD/MM/YYYY HH:mm:ss")}
                </TableCell>
                <TableCell>{item.template}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default WorkHistory;
