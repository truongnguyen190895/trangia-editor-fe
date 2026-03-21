import {
  Box,
  Table,
  TableCell,
  TableRow,
  TableHead,
  Typography,
  TableBody,
  Pagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import { listWorkHistory, type WorkHistoryItem } from "@/api/contract";
import { useEffect, useRef, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { templates } from "@/database";
import { useNavigate } from "react-router-dom";
import { getTemplateName } from "@/utils/common";
import { LoadingDialog } from "@/components/common/loading-dialog";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";

const DEBOUNCE_MS = 500;

const WorkHistory = () => {
  const [loading, setLoading] = useState(false);
  const [workHistory, setWorkHistory] = useState<WorkHistoryItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [dateBegin, setDateBegin] = useState<Dayjs | null>(null);
  const [dateEnd, setDateEnd] = useState<Dayjs | null>(null);
  const [partyNameInput, setPartyNameInput] = useState("");
  const [debouncedPartyName, setDebouncedPartyName] = useState("");
  const prevDebouncedPartyName = useRef<string | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedPartyName(partyNameInput.trim());
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [partyNameInput]);

  useEffect(() => {
    if (
      prevDebouncedPartyName.current !== undefined &&
      prevDebouncedPartyName.current !== debouncedPartyName
    ) {
      setPage(1);
    }
    prevDebouncedPartyName.current = debouncedPartyName;
  }, [debouncedPartyName]);

  useEffect(() => {
    setLoading(true);
    listWorkHistory({
      size: 20,
      page: page - 1,
      dateBegin: dateBegin ? dayjs(dateBegin).format("YYYY-MM-DD") : undefined,
      dateEnd: dateEnd ? dayjs(dateEnd).format("YYYY-MM-DD") : undefined,
      partyName: debouncedPartyName || undefined,
    })
      .then((resp) => {
        setWorkHistory(resp?.content ?? []);
        setTotalPages(resp?.page?.total_pages ?? 0);
        setTotalElements(resp?.page?.total_elements ?? 0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, dateBegin, dateEnd, debouncedPartyName]);

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
      <Box
        mt="1.5rem"
        mb="1.5rem"
        display="flex"
        flexWrap="wrap"
        gap={2}
        alignItems="center"
      >
        <DatePicker
          label="Từ ngày"
          value={dateBegin}
          onChange={(v) => {
            setDateBegin(v);
            setPage(1);
          }}
          slotProps={{ textField: { size: "small" } }}
        />
        <DatePicker
          label="Đến ngày"
          value={dateEnd}
          onChange={(v) => {
            setDateEnd(v);
            setPage(1);
          }}
          slotProps={{ textField: { size: "small" } }}
        />
        <TextField
          size="small"
          label="Tìm theo tên bên (A hoặc B)"
          placeholder="Nhập tên…"
          value={partyNameInput}
          onChange={(e) => setPartyNameInput(e.target.value)}
          sx={{ minWidth: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box mt="0.5rem">
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
