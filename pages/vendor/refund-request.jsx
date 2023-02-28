import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import Scrollbar from "components/Scrollbar";
import useMuiTable from "hooks/useMuiTable";
import { RefundRequestRow } from "pages-sections/admin";
import api from "utils/__api__/vendor";

// table column list
const tableHeading = [{
  id: "orderNo",
  label: "주문번호",
  align: "left"
}, {
  id: "shopName",
  label: "판매사",
  align: "left"
}, {
  id: "product",
  label: "상품 정보",
  align: "left"
}, {
  id: "amount",
  label: "금액",
  align: "left"
}, {
  id: "status",
  label: "처리상태",
  align: "left"
}, {
  id: "action",
  label: "수정/삭제",
  align: "center"
}];

// =============================================================================
RefundRequest.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

// =============================================================================

export default function RefundRequest({
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
    listData: requests
  });
  return <Box py={4}>
      <H3 mb={2}>환불 요청</H3>

      <Card>
        <Scrollbar>
          <TableContainer sx={{
          minWidth: 900
        }}>
            <Table>
              <TableHeader order={order} hideSelectBtn orderBy={orderBy} heading={tableHeading} rowCount={requests.length} numSelected={selected.length} onRequestSort={handleRequestSort} />

              <TableBody>
                {filteredList.map((request, index) => <RefundRequestRow request={request} key={index} />)}
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
  const requests = await api.getAllRefundRequests();
  return {
    props: {
      requests
    }
  };
};