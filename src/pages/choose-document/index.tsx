import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Paper,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { RoundedBox } from "../../components/rounded-box";
import { PageHeader } from "@/components/common/page-header";
import { templates } from "@/database";
import { listWorkHistory, type WorkHistoryItem } from "@/api/contract";
import { getTemplateName } from "@/utils/common";

const mockData = [
  {
    id: 1,
    name: "Hợp Đồng, Giao Dịch",
    description: "Hợp đồng mua bán",
    category: "hop-dong",
    active: true,
  },
  {
    id: 2,
    name: "Đơn",
    description: "Các loại đơn",
    category: "don",
    active: false,
  },
  {
    id: 3,
    name: "Lời Chứng Thực Chữ Ký",
    description: "Lời chứng thực chữ ký",
    category: "chung-thuc",
    active: false,
  },
];

const RECENT_COUNT = 5;

const ChooseDocument = () => {
  const navigate = useNavigate();
  const [recent, setRecent] = useState<WorkHistoryItem[]>([]);

  useEffect(() => {
    // Over-fetch and keep only rows whose template resolves in the local
    // database. Some renders (e.g. giấy uỷ quyền) create id-less Contract rows
    // with a template that doesn't map to any editor; those would otherwise
    // show as blank, unclickable rows here. See resolveTemplate below.
    listWorkHistory({ size: RECENT_COUNT * 4, page: 0 })
      .then((resp) =>
        setRecent(
          (resp?.content ?? [])
            .filter((item) => resolveTemplate(item) && item.id)
            .slice(0, RECENT_COUNT),
        ),
      )
      .catch(() => setRecent([]));
  }, []);

  const handleChooseDocument = (category: string) => {
    navigate(`/van-ban/${category}`);
  };

  const openTemplate = (template: (typeof templates)[number]) => {
    navigate(
      `/editor?type=${template.type}&name=${template.path}&templateId=${template.templateId}`,
    );
  };

  // Resolve a work-history row to its editor template, or undefined if none
  // matches (mirrors the work-history page's lookup).
  const resolveTemplate = (item: WorkHistoryItem) => {
    const [group, subGroup] = item.template?.split("/") ?? ["", ""];
    return templates.find(
      (template) =>
        template.subCategory === group && template.path === subGroup,
    );
  };

  // Same resume logic as the work-history page.
  const resumeWorkHistory = (item: WorkHistoryItem) => {
    const document = resolveTemplate(item);
    if (document && item.id) {
      navigate(
        `/editor?type=${document.type}&name=${document.path}&templateId=${document.templateId}&id=${item.id}`,
      );
    }
  };

  const getPartyName = (item: WorkHistoryItem) =>
    item?.content?.["bên_A"]?.["cá_thể"]?.[0]?.tên ?? "";

  return (
    <Box>
      <PageHeader title="Soạn văn bản" />
      <Autocomplete
        options={templates}
        getOptionLabel={(option) => option.name}
        onChange={(_, template) => {
          if (template) {
            openTemplate(template);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Tìm nhanh theo tên mẫu, ví dụ: HĐCN quyền sử dụng đất…"
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
        sx={{ mb: 3, maxWidth: 640 }}
      />
      {recent.length > 0 && (
        <Box mb={3}>
          <Typography variant="overline" sx={{ mb: 1 }}>
            Soạn gần đây
          </Typography>
          <Paper variant="outlined">
            {recent.map((item, index) => (
              <Box
                key={item.id}
                onClick={() => resumeWorkHistory(item)}
                display="flex"
                alignItems="center"
                gap={1.5}
                sx={{
                  px: 2,
                  py: 1.25,
                  cursor: "pointer",
                  borderTop: index === 0 ? "none" : "1px solid",
                  borderColor: "divider",
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <HistoryIcon fontSize="small" color="action" />
                <Box flex={1} minWidth={0}>
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {getTemplateName(item.template?.split("/")?.[1] ?? "")}
                    {getPartyName(item) ? ` — ${getPartyName(item)}` : ""}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.audit?.created_at
                      ? dayjs(item.audit.created_at).format("DD/MM/YYYY HH:mm")
                      : ""}
                  </Typography>
                </Box>
                <ArrowForwardIcon fontSize="small" color="action" />
              </Box>
            ))}
          </Paper>
        </Box>
      )}
      <Typography variant="overline" sx={{ mb: 1 }}>
        Danh mục văn bản
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {mockData.map((item) => (
          <RoundedBox
            key={item.id}
            active={item.active}
            label={item.name}
            description={item.description}
            onClick={() => handleChooseDocument(item.category)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ChooseDocument;
