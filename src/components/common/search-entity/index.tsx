import {
  Box,
  CircularProgress,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { getContractEntity } from "@/api/contract_entity";

interface SearchEntityProps {
  placeholder: string;
  onSearch: (response: any) => void;
}

export const SearchEntity = ({ placeholder, onSearch }: SearchEntityProps) => {
  const [searchNumber, setSearchNumber] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [isNotExisted, setIsNotExisted] = useState<boolean>(false);

  const handleSearch = () => {
    setSearchLoading(true);
    getContractEntity(searchNumber)
      .then((response) => {
        onSearch(response);
        setIsNotExisted(false);
      })
      .catch(() => {
        setIsNotExisted(true);
      })
      .finally(() => {
        setSearchLoading(false);
      });
  };
  return (
    <>
      <Box
        className="search"
        display="flex"
        alignItems="center"
        gap="10px"
        mb="0.5rem"
      >
        <TextField
          value={searchNumber}
          onChange={(event) => setSearchNumber(event.target.value)}
          placeholder={placeholder}
          sx={{ width: "400px" }}
        />
        <Button
          variant="contained"
          color="success"
          disabled={searchLoading}
          onClick={handleSearch}
        >
          {searchLoading ? <CircularProgress size={20} /> : <SearchIcon />}
        </Button>
      </Box>
      {isNotExisted ? (
        <Typography
          variant="body1"
          fontSize="1.2rem"
          fontWeight="600"
          color="warning.main"
        >
          Số này không tồn tại trong hệ thống và sẽ được lưu lại
        </Typography>
      ) : null}
    </>
  );
};
