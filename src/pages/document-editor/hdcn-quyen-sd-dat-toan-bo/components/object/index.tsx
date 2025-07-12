import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface ObjectEntityProps {
  title: string;
}

export const ObjectEntity = ({ title }: ObjectEntityProps) => {
  return (
    <Box border="1px solid #BCCCDC" borderRadius="5px">
      <Box
        height="80px"
        bgcolor="#3D90D7"
        paddingX="10px"
        display="flex"
        alignItems="center"
      >
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Box padding="10px">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
        //   onClick={handleOpen}
        >
          Thêm
        </Button>
        {/* {partyEntities.length > 0 && (
          <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ông/Bà</TableCell>
                  <TableCell>Họ và tên</TableCell>
                  <TableCell>Ngày sinh</TableCell>
                  <TableCell>Loại giấy tờ</TableCell>
                  <TableCell>Số giấy tờ</TableCell>
                  <TableCell>Ngày cấp</TableCell>
                  <TableCell>Nơi cấp</TableCell>
                  <TableCell>Địa chỉ thường trú</TableCell>
                  <TableCell>Xem/Sửa</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {partyEntities.map((entity, index) => (
                  <TableRow key={entity.documentNumber}>
                    <TableCell>{entity.gender}</TableCell>
                    <TableCell>{entity.name}</TableCell>
                    <TableCell>
                      {dayjs(entity.dateOfBirth).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>{entity.documentType}</TableCell>
                    <TableCell>{entity.documentNumber}</TableCell>
                    <TableCell>{entity.documentIssuedDate}</TableCell>
                    <TableCell>{entity.documentIssuedBy}</TableCell>
                    <TableCell>{entity.address}</TableCell>
                    <TableCell>
                      <EditIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleEditEntity(index)}
                      />
                      <DeleteIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleDeleteEntity(entity)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )} */}
      </Box>
    </Box>
  );
};
