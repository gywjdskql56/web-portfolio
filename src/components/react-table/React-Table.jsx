import React, { useMemo } from 'react';
import { Box, Stack, Grid, Container } from '@mui/material';
import MaterialReactTable from 'material-react-table';
import Typography from '@material-ui/core/Typography';
import Pie from "components/chart/Piechart";
//import { data } from './data';


const ReactTable = ({table}) => {
  const columnlist = ["Ticker", "Name", "Weight","Shares",'Market Value'];
  const pie_data = [
                {"id": "PLD",
                "label": "PLD",
                "value": 6.32,
                "color": "hsl(10, 70%, 50%)"},
                {"id": "AMT",
                "label": "AMT",
                "value": 5.37,
                "color": "hsl(60, 70%, 50%)"},
                {"id": "EQIX",
                "label": "EQIX",
                "value": 3.57,
                "color": "hsl(110, 70%, 50%)"},
                {"id": "CCI",
                "label": "CCI",
                "value": 3.27,
                "color": "hsl(160, 70%, 50%)"},
                {"id": "ET",
                "label": "ET",
                "value": 2.57,
                "color": "hsl(210, 70%, 50%)"},
                {"id": "PSA",
                "label": "PSA",
                "value": 2.50,
                "color": "hsl(260, 70%, 50%)"},
                {"id": "MMP",
                "label": "MMP",
                "value": 2.47,
                "color": "hsl(30, 70%, 50%)"},
                {"id": "WES",
                "label": "WES",
                "value": 2.46,
                "color": "hsl(80, 70%, 50%)"},
                {"id": "PAA",
                "label": "PAA",
                "value": 2.45,
                "color": "hsl(130, 70%, 50%)"},

                ]
  const data = [
      {name: "PLD",
      email: "Prologis INC.",
      phone: "6.32%",
      phone2: "359.00",
      phone3: "46598",},
      {name: "AMT",
      email: "American Tower Corp",
      phone: "5.37%",
      phone2: "181.00",
      phone3: "39543",},
      {name: "EQIX",
      email: "Equinix INC",
      phone: "3.57%",
      phone2: "36.00",
      phone3: "26315",},
      {name: "CCI",
      email: "Crown Castle INC",
      phone: "3.27%",
      phone2: "168.00",
      phone3: "24094",},
      {name: "ET",
      email: "Energy Transfer L P",
      phone: "2.52%",
      phone2: "1454.00",
      phone3: "18582",},
      {name: "PSA",
      email: "Publick Storage",
      phone: "2.50%",
      phone2: "61.00",
      phone3: "18422",},
      {name: "MMP",
      email: "Magellan Midstream Prtnrs LP COM UNIT RP LP",
      phone: "2.47%",
      phone2: "341.00",
      phone3: "18188",},
      {name: "WES",
      email: "Western Midstream Partners LP COM UNIT LP INT",
      phone: "2.46%",
      phone2: "649.00",
      phone3: "18146",},
      {name: "MPLX",
      email: "MPLX LP",
      phone: "2.46%",
      phone2: "524.00",
      phone3: "18125",},
      {name: "PAA",
      email: "Plains All Amern Pipeline LP UNIT LTD Partn",
      phone: "2.45%",
      phone2: "1421.00",
      phone3: "18075",},
    ]
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
        header: '자산군',
        accessorKey: 'state',
        size:170,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() == "Alternative Fund"
                  ? "#4B0082"
                  : cell.getValue() == "Asset Allocation Fund"
                  ? "#8A2BE2"
                  : cell.getValue() == "Closed-end Funds"
                  ? "#BA55D3"
                  : cell.getValue() == "Commodity Fund"
                  ? "#DDA0DD"
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
        header: '티커',
        accessorKey: 'firstName',
        enableGrouping: false,
        size:140,
      },
      {
        header: 'ETF명',
        accessorKey: 'Name',
        size:280,
      },
      {
        header: '운용사',
        accessorKey: 'lastName',
      },
      {
        header: '시가총액',
        accessorKey: 'age',
        aggregationFn: 'max',
        Cell: ({ cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  color:
                    cell.getValue() < 10000000
                      ? theme.palette.info.dark
                      : theme.palette.error.dark,
                  borderRadius: '0.25rem',
                  maxWidth: '9ch',
                  p: '0.25rem',
                  fontWeight: 'bold',
                })}
              >
              {cell.getValue()}
              </Box>
            ),
      },
      {
        header: '수익률(1개월)',
        accessorKey: 'gender',
        GroupedCell: ({ cell, row }) => (
          <Box sx={{ color: 'primary.main' }}>
            <strong>{cell.getValue()}s </strong> ({row.subRows?.length})
          </Box>
        ),
        Cell: ({ cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  backgroundColor:
                    cell.getValue() < 0
                      ? theme.palette.info.dark
                      : theme.palette.error.dark,
                  borderRadius: '0.25rem',
                  color: '#fff',
                  maxWidth: '9ch',
                  p: '0.25rem',
                })}
              >
              {cell.getValue()}%
              </Box>
            ),
      },

      {
        header: '수익률(1주)',
        accessorKey: 'salary',
        aggregationFn: 'mean',
        Cell: ({ cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  backgroundColor:
                    cell.getValue() < 0
                      ? theme.palette.info.dark
                      : cell.getValue() >= 0 &&
                        cell.getValue() != '-'
                      ? theme.palette.error.dark
                      : theme.palette.warning.dark,
                  borderRadius: '0.25rem',
                  color: '#fff',
                  maxWidth: '9ch',
                  p: '0.25rem',
                })}
              >
              {cell.getValue()}%
              </Box>
            ),
      },
      {
        header: '상장일',
        accessorKey: 'date',
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
      renderDetailPanel={({ row }) => (
          <Box sx={{ textAlign: 'left' }}>
          <Grid container spacing={3}>
          <Grid item lg={5} md={5} sm={5} xs={12}>
            <Typography variant="h6">ETF 소개</Typography>
            <Typography>이 펀드는 독점적인 기계 학습 알고리즘을 사용하여 각 주요 헤지 펀드 스타일(장기/단기 주식, 글로벌 매크로, 이벤트 기반, 채권 차익 거래, 신흥 시장 등)의 가장 최근 달 수익률과 가장 잘 일치하는 포트폴리오를 생성함으로써 운용합니다.</Typography>
            <Container sx={{ mb: "20px" }} />
            <Typography variant="h6">TOP 10 holdings</Typography>
            <table>
              <thead>
                <tr>
                  {columnlist.map((column) => (
                    <th key={column}><Typography variant="subtitle2">{column} </Typography></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(({ name, email, phone, phone2, phone3 }) => (
                  <tr key={name + email + phone + phone2 + phone3}>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>{phone}</td>
                    <td>{phone2}</td>
                    <td>{phone3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </Grid>
            <Grid item lg={4} md={4} sm={4} xs={12}>
            <div style={{height: 400}}>
                   <Typography align="center">
                      기초 포트폴리오
                   </Typography>
                <Pie piedata={pie_data} />
             </div>
             </Grid>
             </Grid>
          </Box>
//        </Box>
      )}
      initialState={{
        density: 'compact',
        //expanded: true, //expand all groups by default
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
