import { Delete, RemoveRedEye } from "@mui/icons-material";
import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import AdminDashboardLayout from "components/layouts/admin-dashboard";
import Scrollbar from "components/Scrollbar";
import { H3 } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import { StyledIconButton, StyledTableCell, StyledTableRow } from "pages-sections/admin";
import api from "utils/__api__/dashboard";
import { currency } from "lib";

// table column list
const tableHeading = [{
  id: "no",
  label: "일련번호",
  align: "left"
}, {
  id: "seller",
  label: "판매자",
  align: "left"
}, {
  id: "package",
  label: "패키지",
  align: "left"
}, {
  id: "amount",
  label: "수량",
  align: "left"
}, {
  id: "payment",
  label: "지불 방법",
  align: "left"
}, {
  id: "date",
  label: "날짜",
  align: "left"
}, {
  id: "action",
  label: "수정/삭제",
  align: "center"
}];

// =============================================================================
PackagePayment.getLayout = function getLayout(page) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
// =============================================================================

export default function PackagePayment({
  payments
}) {
  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: payments,
    defaultSort: "no"
  });
  return <Box py={4}>
      <H3 mb={2}>패키지 결제내역</H3>

      <Card>
        <Scrollbar>
          <TableContainer sx={{
          minWidth: 1000
        }}>
            <Table>
              <TableHeader order={order} hideSelectBtn orderBy={orderBy} heading={tableHeading} rowCount={payments.length} numSelected={selected.length} onRequestSort={handleRequestSort} />

              <TableBody>
                {filteredList.map((item, index) => <StyledTableRow role="checkbox" key={index}>
                    <StyledTableCell align="left">{item.no}</StyledTableCell>
                    <StyledTableCell align="left">
                      {item.seller}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {item.package}
                    </StyledTableCell>

                    <StyledTableCell align="left">
                      {currency(item.amount)}
                    </StyledTableCell>

                    <StyledTableCell align="left">
                      {item.payment}
                    </StyledTableCell>
                    <StyledTableCell align="left">{item.date}</StyledTableCell>

                    <StyledTableCell align="center">
                      <StyledIconButton>
                        <RemoveRedEye />
                      </StyledIconButton>

                      <StyledIconButton>
                        <Delete />
                      </StyledIconButton>
                    </StyledTableCell>
                  </StyledTableRow>)}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination onChange={handleChangePage} count={Math.ceil(payments.length / rowsPerPage)} />
        </Stack>
      </Card>
    </Box>;
}
export const getStaticProps = async () => {
  const payments = await api.packagePayments();
  return {
    props: {
      payments
    }
  };
};