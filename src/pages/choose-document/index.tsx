import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RoundedBox } from "../../components/rounded-box";

const mockData = [
    {
        id: 1,
        name: "Hợp Đồng, Giao Dịch",
        description: "Hợp đồng mua bán",
        category: "hop-dong",
    },
    {
        id: 2,
        name: "Đơn",
        description: "Các loại đơn",
        category: "don",
    },
    {
        id: 3,
        name: "Lời Chứng Thực Chữ Ký",
        description: "Lời chứng thực chữ ký",
        category: "chung-thuc",
    },
];

const ChooseDocument = () => {
  const navigate = useNavigate();

  const handleChooseDocument = (category: string) => {
    navigate(`/van-ban/${category}`);
  };

  return (
    <Box>
      <Typography variant="h3">Chọn loại giấy tờ</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }} mt="20px">
        {mockData.map((item) => (
          <RoundedBox key={item.id} label={item.name} description={item.description} onClick={() => handleChooseDocument(item.category)} />
        ))}
      </Box>
    </Box>
  );
};

export default ChooseDocument;
