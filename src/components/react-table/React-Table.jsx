import React, { useMemo } from 'react';
import { Box, Stack } from '@mui/material';
import MaterialReactTable from 'material-react-table';
//import { data } from './data';


const ReactTable = ({table}) => {
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
      },
      {
        header: '티커',
        accessorKey: 'firstName',
        enableGrouping: false, //do not let this column be grouped
      },
      {
        header: 'ETF명',
        accessorKey: 'Name',
      },
      {
        header: '운용사',
        accessorKey: 'lastName',
      },
      {
        header: '시가총액',
        accessorKey: 'age',
        aggregationFn: 'max',
      },
      {
        header: '수익률(1개월)',
        accessorKey: 'gender',
        GroupedCell: ({ cell, row }) => (
          <Box sx={{ color: 'primary.main' }}>
            <strong>{cell.getValue()}s </strong> ({row.subRows?.length})
          </Box>
        ),
      },

      {
        header: '수익률(1주)',
        accessorKey: 'salary',
        aggregationFn: 'mean',
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
      initialState={{
        density: 'compact',
        expanded: true, //expand all groups by default
        grouping: ['state'], //an array of columns to group by by default (can be multiple)
        pagination: { pageIndex: 0, pageSize: 20 },
        sorting: [{ id: 'state', desc: false }], //sort by state by default
      }}
      muiToolbarAlertBannerChipProps={{ color: 'primary' }}
      muiTableContainerProps={{ sx: { maxHeight: 700 } }}
    />
  );
};

export default ReactTable;
