import React, { useMemo } from 'react';
import { Box, Stack } from '@mui/material';
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';


const PeriodTable = ({table}) => {
  const averageSalary = useMemo(
    () => table.reduce((acc, curr) => acc + curr.salary, 0) / table.length,
    [],
  );

  const maxAge = useMemo(
    () => table.reduce((acc, curr) => Math.max(acc, curr.age), 0),
    [],
  );

  const columns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: 'address',
        header: '1일 수익률',
      },
      {
        accessorKey: 'firstName',
        header: '1주 수익률',
      },
      {
        accessorKey: 'lastName',
        header: '1개월 수익률',
      },
      {
        accessorKey: 'city',
        header: '6개월 수익률',
      },
      {
        accessorKey: 'state',
        header: '1년 수익률',
      },
      {
        accessorKey: 'state1',
        header: 'YTD',
      },
    ],
    [],
    //end
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={table}
      enableColumnActions={false}
      enableColumnFilters={false}
      enablePagination={false}
      enableSorting={false}
      enableBottomToolbar={false}
      enableTopToolbar={false}
      muiTableBodyRowProps={{ hover: false }}
    />
  );
};

export default PeriodTable;
