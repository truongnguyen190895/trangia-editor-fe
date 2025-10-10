import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RoundedBox } from "../../components/rounded-box";

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

const ChooseDocument = () => {
  const navigate = useNavigate();

  const handleChooseDocument = (category: string) => {
    navigate(`/van-ban/${category}`);
  };

  return (
    <Box>
      <Typography fontWeight={600} variant="h3">
        Chọn danh mục văn bản
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }} mt="20px">
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
