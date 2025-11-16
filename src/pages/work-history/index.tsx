import {
  Box,
  Table,
  TableCell,
  TableRow,
  TableHead,
  Typography,
  TableBody,
  Pagination,
} from "@mui/material";
import { listWorkHistory } from "@/api/contract";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { templates } from "@/database";
import { useNavigate } from "react-router-dom";
import { getTemplateName } from "@/utils/common";
import { LoadingDialog } from "@/components/common/loading-dialog";

const WorkHistory = () => {
  const [loading, setLoading] = useState(false);
  const [workHistory, setWorkHistory] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    listWorkHistory({ size: 20, page: page - 1 })
      .then((resp) => {
        setWorkHistory(resp?.content ?? []);
        setTotalPages(resp?.page?.total_pages ?? 0);
        setTotalElements(resp?.page?.total_elements ?? 0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  const handleClick = (templatePath: string, id: string) => {
    const [group, subGroup] = templatePath?.split("/") ?? ["", ""];
    const filterByGroup = templates.filter((template) => template.subCategory === group);
    const document = filterByGroup.find((template) => template.path === subGroup);
    if (document && id) {
      navigate(
        `/editor?type=${document.type}&name=${document.path}&templateId=${document.templateId}&id=${id}`
      );
    }
  };

  const renderCreatedAt = (value?: string) => {
    if (!value) {
      return "";
    }
    const formatted = dayjs(value).format("DD/MM/YYYY HH:mm:ss");
    return formatted;
  };

  const getPartyName = (content: any, partyKey: "bên_A" | "bên_B") => {
    return content?.[partyKey]?.["cá_thể"]?.[0]?.tên ?? "";
  };

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <Box>
      <Typography variant="h3">Lịch sử soạn thảo ({totalElements})</Typography>
      <Box mt="2rem">
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell width="15%">Ngày tạo</TableCell>
              <TableCell width="45%">Tên văn bản</TableCell>
              <TableCell width="20%">Bên A</TableCell>
              <TableCell width="20%">Bên B</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workHistory.map((item, idx) => (
              <TableRow
                key={item?.id ?? idx}
                onClick={() => handleClick(item?.template ?? "", item?.id ?? "")}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  },
                }}
              >
                <TableCell>{renderCreatedAt(item?.audit?.created_at)}</TableCell>
                <TableCell>
                  {getTemplateName(item?.template?.split("/")?.[1] ?? "")}
                </TableCell>
                <TableCell>{getPartyName(item?.content, "bên_A")}</TableCell>
                <TableCell>{getPartyName(item?.content, "bên_B")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box
          className="pagination-container"
          display="flex"
          justifyContent="center"
          mt="2rem"
        >
          <Pagination
            count={totalPages}
            page={page}
            shape="rounded"
            onChange={handleChangePage}
          />
        </Box>
      </Box>
      <LoadingDialog open={loading} />
    </Box>
    );
};

export default WorkHistory;
