import { Box, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { RoundedBox } from "../../components/rounded-box";

const mockData = [
  {
    id: 1,
    name: "Nhóm chuyển nhượng, mua bán",
    description: "Chuyển nhượng, mua bán",
    category: "hop-dong",
    subCategory: "chuyen-nhuong-mua-ban",
  },
  {
    id: 2,
    name: "Nhóm Uỷ Quyền",
    description: "Uỷ quyền",
    category: "hop-dong",
    subCategory: "uy-quyen",
  },
];

const ChooseSubDocument = () => {
  const navigate = useNavigate();
  const { category } = useParams();

  const handleChooseDocument = (subCategory: string) => {
    navigate(`${location.pathname}/${subCategory}`);
  };

  return (
    <Box>
      <Typography variant="h3">Chọn loại giấy tờ</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }} mt="20px">
        {mockData
          .filter((item) => item.category === category)
          .map((item) => (
            <RoundedBox
              key={item.id}
              label={item.name}
              description={item.description}
              onClick={() => handleChooseDocument(item.subCategory)}
            />
          ))}
        {mockData.filter((item) => item.category === category).length === 0 && (
          <Typography variant="h4">Không có dữ liệu</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChooseSubDocument;
