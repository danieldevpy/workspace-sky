'use client';
import React from 'react';
import { WorkPage } from '../schema/WorkSpace';
import { SearchInput } from './SearchInput';
import {
  Typography,
  Box,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button
} from '@mui/material';
import FavIcon from './FavIcon';

export function ListWorkPage(props: {workpages: WorkPage[], editWorkPage: (workpage: WorkPage)=> void}) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(5);

  const filteredContexts = props.workpages.filter((workpage) =>
    workpage.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset para a primeira página quando o termo de busca ou itens por página mudam
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, itemsPerPage]);

  // Cálculo dos itens da página atual
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredContexts.slice(startIndex, endIndex);

  return (
    <div >
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Pesquisar por nome..."
        label="Filtrar WorkPages"
      />

      {filteredContexts.length === 0 ? (
        <Typography>
          Nenhum resultado encontrado para &quot;{searchTerm}&quot;
        </Typography>
      ) : (
        <>
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1
        }}>
          {currentPageData.map((workpage, i) => (
            <Box
            key={`lwp-${i}`}
            sx={{
              display: "flex",
              alignItems: "center",

            }}>
                <Button sx={{
                  display: "flex",
                  padding: 2,
                  gap: 2,
                }}
                onClick={()=>props.editWorkPage(workpage)}>
                  <FavIcon size={12} url={`${workpage.url}`}/>
                  <label key={"p"+i}>{workpage.name}</label>
                </Button>
                <Typography
                  sx={{
                    color: "grey",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100%", // ou um valor fixo como '300px' se quiser limitar
                  }}
                >
                  {workpage.url}
                </Typography>
            </Box>
          ))}
      </Box>
          {/* Controles de paginação */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 5,
            px: 2
          }}>
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Itens por página</InputLabel>
              <Select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                label="Itens por página"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
              </Select>
            </FormControl>

            <Pagination
              count={Math.ceil(filteredContexts.length / itemsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
          
        </>
      )}
    </div>
  );
}