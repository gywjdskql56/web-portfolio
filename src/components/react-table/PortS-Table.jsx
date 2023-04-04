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
        header: '티커명',
        accessorKey: 'lastName',
      },
      {
        header: '비중',
        accessorKey: 'Name',
        Cell: ({ cell }) => <div>{cell.getValue()}%</div>,
        AggregatedCell: ({ cell }) => <Box sx={{ color: 'error.main', fontWeight: 'bold' }}>합계: {Math.round(cell.getValue(),2)} %</Box>,
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
      enableColumnDragging={false}
      initialState={{
        density: 'compact',
        expanded: true, //expand all groups by default
        grouping: ['state'], //an array of columns to group by by default (can be multiple)
        pagination: { pageIndex: 0, pageSize: 30 },
        sorting: [{ id: 'state', desc: false }], //sort by state by default
      }}
      muiToolbarAlertBannerChipProps={{ color: 'primary' }}
      muiTableContainerProps={{ sx: { maxHeight: 1000 } }}
    />
  );
};

export default ReactTable;
