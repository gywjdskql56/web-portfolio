import React, { useMemo } from 'react';
import { Box, Stack, Grid, Container } from '@mui/material';
import MaterialReactTable from 'material-react-table';
import Typography from '@material-ui/core/Typography';
import Pie from "components/chart/Piechart";

const ReactTable = ({table}) => {
  const columnlist = ["Ticker", "Name", "Weight","Shares",'Market Value'];
  const averageSalary = useMemo(
    () => table.reduce((acc, curr) => acc + curr.salary, 0) / table.length,
    [],
  );

  const maxAge = useMemo(
    () => table.reduce((acc, curr) => Math.max(acc, curr.age), 0),
    [],
  );

  const columns = useMemo(
    () => [
       {
        header: '발표일',
        accessorKey: 'state',
        size:130,
      },
       {
        header: '종목명',
        accessorKey: 'state1',
        size:130,
      },
      {
        header: '종목코드',
        accessorKey: 'state2',
        size:150,
      },
      {
        header: '유형',
        accessorKey: 'state3',
        size:130,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() == "별도"
                  ? "#C0C0C0"
                  : cell.getValue() == "연결"
                  ? "#808080"
                  : "#fff",
              borderRadius: '0.25rem',
              fontWeight: 'normal',
              maxWidth: '9ch',
              p: '0.25rem',
              color: '#fff',
            })}>
          {cell.getValue()}
          </Box>
        ),
      },
      {
        header: '자산군',
        accessorKey: 'firstName',
        size:130,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() == "코스피"
                  ? "#4B0082"
                  : cell.getValue() == "코스닥"
                  ? "#8A2BE2"
                  : "#DB7093",
              borderRadius: '0.25rem',
              fontWeight: 'normal',
              maxWidth: '9ch',
              p: '0.25rem',
              color: '#fff',
            })}
          >
          {cell.getValue()}
          </Box>
        ),
      },
      {
        header: '섹터',
        accessorKey: 'Name',
        size:130,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() == "경기소비재"
                  ? "#006400"
                  : cell.getValue() == "산업재"
                  ? "#0A6E0A"
                  : cell.getValue() == "소재"
                  ? "#147814"
                  : cell.getValue() == "IT"
                  ? "#1E821E"
                  : cell.getValue() == "유틸리티"
                  ? "#288C28"
                  : cell.getValue() == "커뮤니케이션 서비스"
                  ? "#329632"
                  : cell.getValue() == "필수소비재"
                  ? "#3CA03C"
                  : cell.getValue() == "건강의료"
                  ? "#41A541"
                  : cell.getValue() == "에너지"
                  ? "#46AA46"
                  : cell.getValue() == "금융"
                  ? "#4BAF4B"
                  : "#6DD66D",
              borderRadius: '0.25rem',
              fontWeight: 'normal',
              maxWidth: '9ch',
              p: '0.25rem',
              color: '#fff',
            })}
          >
          {cell.getValue()}
          </Box>
        ),
      },
      {
        header: '산업',
        accessorKey: 'age',
        size:100,
      },
      {
        header: '비중',
        accessorKey: 'lastName',
        size:120,
      },
//      {
//        header: '시가총액',
//        accessorKey: 'age',
//        aggregationFn: 'max',
//        Cell: ({ cell }) => (
//              <Box
//                component="span"
//                sx={(theme) => ({
//                  color:
//                    cell.getValue() < 10000000
//                      ? theme.palette.info.dark
//                      : theme.palette.error.dark,
//                  borderRadius: '0.25rem',
//                  maxWidth: '9ch',
//                  p: '0.25rem',
//                  fontWeight: 'bold',
//                })}
//              >
//              {cell.getValue()}
//              </Box>
//            ),
//      },
      {
        header: '분기실적(판매액)',
        accessorKey: 'gender',
        size:170,
        GroupedCell: ({ cell, row }) => (
        <Box>
          <strong>{cell.getValue()} 억원 </strong> ({row.subRows?.length})
        </Box>
        ),
      },
      {
        header: '분기실적(영업이익)',
        size:170,
        accessorKey: 'salary',
        Cell: ({ cell }) => (
              <Box>
              {cell.getValue()}
              </Box>),
      },
      {
        header: '분기실적(순이익)',
        size:200,
        accessorKey: 'date',
        Cell: ({ cell }) => (
              <Box>
              {cell.getValue()}
              </Box>),
      },
      {
        header: '컨센대비(판매량)',
        accessorKey: 'cons1',
        size:200,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() == "상회"
                  ? "#FF0000"
                  : cell.getValue() == "보합"
                  ? "#000000"
                  : cell.getValue() == "하회"
                  ? "#0000FF"
                  : "#fff",
              borderRadius: '0.25rem',
              fontWeight: 'normal',
              maxWidth: '9ch',
              p: '0.25rem',
              color: '#fff',
            })}>
          {cell.getValue()}
          </Box>
        ),
      },
      {
        header: '컨센대비(영업이익)',
        accessorKey: 'cons2',
        size:220,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() == "상회"
                  ? "#FF0000"
                  : cell.getValue() == "보합"
                  ? "#000000"
                  : cell.getValue() == "하회"
                  ? "#0000FF"
                  : "#fff",
              borderRadius: '0.25rem',
              fontWeight: 'normal',
              maxWidth: '9ch',
              p: '0.25rem',
              color: '#fff',
            })}>
          {cell.getValue()}
          </Box>
        ),
      },
      {
        header: '컨센대비(순이익)',
        accessorKey: 'cons3',
        size:200,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() == "상회"
                  ? "#FF0000"
                  : cell.getValue() == "보합"
                  ? "#000000"
                  : cell.getValue() == "하회"
                  ? "#0000FF"
                  : "#fff",
              borderRadius: '0.25rem',
              fontWeight: 'normal',
              maxWidth: '9ch',
              p: '0.25rem',
              color: '#fff',
            })}>
          {cell.getValue()}
          </Box>
        ),
      },
      {
        header: 'QoQ_S',
        accessorKey: 'data1',
        size:130,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              color:
                cell.getValue() < -5
                  ? "#0000FF"
                  : cell.getValue() > 0
                  ? "#FF0000"
                  : "#000000",
              borderRadius: '0.25rem',
              fontWeight: 'bold',
              maxWidth: '9ch',
              p: '0.25rem',
            })}>
          {cell.getValue()}%
          </Box>
        ),
      },
      {
        header: 'QoQ_OP',
        accessorKey: 'data2',
        size:140,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              color:
                cell.getValue() == "적전" || cell.getValue() == "적지" || cell.getValue() < -5
                  ? "#0000FF"
                  : cell.getValue() == "흑전" || cell.getValue() > 5
                  ? "#FF0000"
                  : "#000000",
              borderRadius: '0.25rem',
              fontWeight: 'bold',
              maxWidth: '9ch',
              p: '0.25rem',
            })}>
          {cell.getValue()}{cell.getValue()!= "적전"&&cell.getValue()!= "적지"&&cell.getValue()!= "흑전"?"%":""}
          </Box>
        ),
      },
      {
        header: 'QoQ_NI',
        accessorKey: 'data3',
        size:140,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              color:
                cell.getValue() == "적전" || cell.getValue() == "적지" || cell.getValue() < -5
                  ? "#0000FF"
                  : cell.getValue() == "흑전" || cell.getValue() > 5
                  ? "#FF0000"
                  : "#000000",
              borderRadius: '0.25rem',
              fontWeight: 'bold',
              maxWidth: '9ch',
              p: '0.25rem',
            })}>
          {cell.getValue()}{cell.getValue()!= "적전"&&cell.getValue()!= "적지"&&cell.getValue()!= "흑전"?"%":""}
          </Box>
        ),
      },
      {
        header: 'YoY_S',
        accessorKey: 'data4',
        size:140,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              color:
                cell.getValue() < -5
                  ? "#0000FF"
                  : cell.getValue() > 0
                  ? "#FF0000"
                  : "#000000",
              borderRadius: '0.25rem',
              fontWeight: 'bold',
              maxWidth: '9ch',
              p: '0.25rem',
            })}>
          {cell.getValue()}%
          </Box>
        ),
      },
      {
        header: 'YoY_OP',
        accessorKey: 'data5',
        size:140,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              color:
                cell.getValue() == "적전" || cell.getValue() == "적지" || cell.getValue() < -5
                  ? "#0000FF"
                  : cell.getValue() == "흑전" || cell.getValue() > 5
                  ? "#FF0000"
                  : "#000000",
              borderRadius: '0.25rem',
              fontWeight: 'bold',
              maxWidth: '9ch',
              p: '0.25rem',
            })}>
          {cell.getValue()}{cell.getValue()!= "적전"&&cell.getValue()!= "적지"&&cell.getValue()!= "흑전"?"%":""}
          </Box>
        ),
      },
      {
        header: 'YoY_NI',
        accessorKey: 'data6',
        size:140,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              color:
                cell.getValue() == "적전" || cell.getValue() == "적지" || cell.getValue() < -5
                  ? "#0000FF"
                  : cell.getValue() == "흑전" || cell.getValue() > 5
                  ? "#FF0000"
                  : "#000000",
              borderRadius: '0.25rem',
              fontWeight: 'bold',
              maxWidth: '9ch',
              p: '0.25rem',
            })}>
          {cell.getValue()}{cell.getValue()!= "적전"&&cell.getValue()!= "적지"&&cell.getValue()!= "흑전"?"%":""}
          </Box>
        ),
      },
    ],
    [averageSalary, maxAge],
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={table}
      enableColumnResizing
      enableGrouping
      enableStickyHeader
      enableStickyFooter
      initialState={{
        density: 'compact',
        //grouping: ['state'], //an array of columns to group by by default (can be multiple)
        pagination: { pageIndex: 0, pageSize: 20 },
        sorting: [{ id: 'state', desc: false }], //sort by state by default
      }}
      muiToolbarAlertBannerChipProps={{ color: 'primary' }}
      muiTableContainerProps={{ sx: { maxHeight: 700 } }}
    />
  );
};

export default ReactTable;
