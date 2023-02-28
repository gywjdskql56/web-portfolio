import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import Scrollbar from "components/Scrollbar";
import { H3 } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import { StatusWrapper, StyledTableCell, StyledTableRow } from "pages-sections/admin";
import { currency } from "lib";
import api from "utils/__api__/vendor";
const tableHeading = [{
  id: "no",
  label: "번호",
  align: "left"
}, {
  id: "date",
  label: "날짜",
  align: "left"
}, {
  id: "amount",
  label: "금액",
  align: "center"
}, {
  id: "status",
  label: "상태",
  align: "center"
}, {
  id: "message",
  label: "메시지",
  align: "center"
}];

// =============================================================================
PayoutRequests.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

export default function PayoutRequests({
  payoutRequests
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
    listData: payoutRequests,
    defaultSort: "no"
  });
  return <Box py={4}>
      <H3 mb={2}>대금결제 요청</H3>

      <Card>
        <Scrollbar>
          <TableContainer sx={{
          minWidth: 800
        }}>
            <Table>
              <TableHeader order={order} hideSelectBtn orderBy={orderBy} heading={tableHeading} numSelected={selected.length} rowCount={filteredList.length} onRequestSort={handleRequestSort} />

              <TableBody>
                {filteredList.map((payout, index) => <StyledTableRow role="checkbox" key={index}>
                    <StyledTableCell align="left">{payout.no}</StyledTableCell>
                    <StyledTableCell align="left">
                      {payout.date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {currency(payout.amount)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <StatusWrapper status={payout.status}>
                        {payout.status}
                      </StatusWrapper>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {payout.message}
                    </StyledTableCell>
                  </StyledTableRow>)}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination onChange={handleChangePage} count={Math.ceil(filteredList.length / rowsPerPage)} />
        </Stack>
      </Card>
    </Box>;
}
export const getStaticProps = async () => {
  const payoutRequests = await api.getAllPayoutRequests();
  return {
    props: {
      payoutRequests
    }
  };
};