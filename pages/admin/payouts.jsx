import { RemoveRedEye } from "@mui/icons-material";
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
  id: "sellerInfo",
  label: "판매자 정보",
  align: "left"
}, {
  id: "amount",
  label: "금액",
  align: "left"
}, {
  id: "date",
  label: "날짜",
  align: "left"
}, {
  id: "payment",
  label: "지불 방법",
  align: "center"
}, {
  id: "action",
  label: "수정/삭제",
  align: "center"
}];

// =============================================================================
Payouts.getLayout = function getLayout(page) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
// =============================================================================

// =============================================================================

export default function Payouts({
  payouts
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
    listData: payouts,
    defaultSort: "no"
  });
  return <Box py={4}>
      <H3 mb={2}>대금 결제</H3>

      <Card>
        <Scrollbar>
          <TableContainer sx={{
          minWidth: 800
        }}>
            <Table>
              <TableHeader order={order} hideSelectBtn orderBy={orderBy} heading={tableHeading} rowCount={payouts.length} numSelected={selected.length} onRequestSort={handleRequestSort} />

              <TableBody>
                {filteredList.map((payout, index) => <StyledTableRow role="checkbox" key={index}>
                    <StyledTableCell align="left">{payout.no}</StyledTableCell>
                    <StyledTableCell align="left">
                      {payout.sellerInfo}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {currency(payout.amount)}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {payout.date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {payout.payment}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <StyledIconButton>
                        <RemoveRedEye />
                      </StyledIconButton>
                    </StyledTableCell>
                  </StyledTableRow>)}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination onChange={handleChangePage} count={Math.ceil(payouts.length / rowsPerPage)} />
        </Stack>
      </Card>
    </Box>;
}
export const getStaticProps = async () => {
  const payouts = await api.payouts();
  return {
    props: {
      payouts
    }
  };
};