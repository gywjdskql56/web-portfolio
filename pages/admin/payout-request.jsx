import { RemoveRedEye } from "@mui/icons-material";
import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import AdminDashboardLayout from "components/layouts/admin-dashboard";
import Scrollbar from "components/Scrollbar";
import { H3 } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import { StatusWrapper, StyledTableRow, StyledTableCell, StyledIconButton } from "pages-sections/admin";
import api from "utils/__api__/dashboard";
import { currency } from "lib";

// table column list
const tableHeading = [{
  id: "no",
  label: "일련번호",
  align: "left"
}, {
  id: "seller",
  label: "판매자 정보",
  align: "left"
}, {
  id: "shopName",
  label: "판매사",
  align: "left"
}, {
  id: "totalAmount",
  label: "총 금액",
  align: "left"
}, {
  id: "requestAmount",
  label: "요청 금액",
  align: "left"
}, {
  id: "date",
  label: "날짜",
  align: "left"
}, {
  id: "status",
  label: "상태",
  align: "left"
}, {
  id: "action",
  label: "수정/삭제",
  align: "center"
}];

// =============================================================================
PayoutRequests.getLayout = function getLayout(page) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
// =============================================================================

// =============================================================================

export default function PayoutRequests({
  requests
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
    listData: requests,
    defaultSort: "no"
  });
  return <Box py={4}>
      <H3 mb={2}>대금 결제 요청</H3>

      <Card>
        <Scrollbar>
          <TableContainer sx={{
          minWidth: 1100
        }}>
            <Table>
              <TableHeader order={order} hideSelectBtn orderBy={orderBy} heading={tableHeading} rowCount={requests.length} numSelected={selected.length} onRequestSort={handleRequestSort} />

              <TableBody>
                {filteredList.map((request, index) => <StyledTableRow role="checkbox" key={index}>
                    <StyledTableCell align="left">{request.no}</StyledTableCell>
                    <StyledTableCell align="left">
                      {request.seller}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {request.shopName}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {currency(request.totalAmount)}
                    </StyledTableCell>

                    <StyledTableCell align="left">
                      {currency(request.requestAmount)}
                    </StyledTableCell>

                    <StyledTableCell align="left">
                      {request.date}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <StatusWrapper status={request.status}>
                        {request.status}
                      </StatusWrapper>
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
          <TablePagination onChange={handleChangePage} count={Math.ceil(requests.length / rowsPerPage)} />
        </Stack>
      </Card>
    </Box>;
}
export const getStaticProps = async () => {
  const requests = await api.payoutRequests();
  return {
    props: {
      requests
    }
  };
};