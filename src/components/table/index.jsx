import React, { useState } from "react";
import { Box, Container, Grid, styled } from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  color:
    theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  WebkitFontSmoothing: 'auto',
  letterSpacing: 'normal',
  '& .MuiDataGrid-columnsContainer': {
    backgroundColor: theme.palette.mode === 'light' ? '#F58220' : '#1d1d1d',
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    borderLeft: `5px solid ${
      theme.palette.mode === 'light' ? '#043B72' : '#303030'
    }`,
    borderBottom: `5px solid ${
      theme.palette.mode === 'light' ? '#043B72' : '#303030'
    }`,
    backgroundColor:
      theme.palette.mode === 'light' ? ' #F58220' : 'rgba(255,255,255,0.65)',
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
    borderBottom: `0px solid ${
      theme.palette.mode === 'light' ? '##043B72' : '#303030'
    }`,
    backgroundColor:
      theme.palette.mode === 'light' ? ' #fafafa' : 'rgba(255,255,255,0.65)',
  },
  '& .MuiDataGrid-cell': {
    color:
      theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.65)',
  },
  '& .MuiPaginationItem-root': {
    borderRadius: 0,
  },
}));
const other = {
  autoHeight: true,
  showCellRightBorder: true,
  showColumnRightBorder: true,
};


function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      variant="outlined"
      shape="rounded"
      page={page + 1}
      count={pageCount}
      // @ts-expect-error
      renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

const RowSpanning = ({
  table,
  pageSize,
  columns
}) => {
  console.log(table)
  const rows = table
  const pages = pageSize

    return ( <div style={{ height: 55* pages+100, width: '100%' }}>
    <StyledDataGrid
//        checkboxSelection
        pageSize={ pages }
        rowsPerPageOptions={[5]}
        components={{
          Pagination: CustomPagination,
        }}
        rows={rows}
        columns={columns}
      />
    </div>);
}
export default RowSpanning;