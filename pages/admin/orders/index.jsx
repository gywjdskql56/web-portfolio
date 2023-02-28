import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import { H3 } from "components/Typography";
import Scrollbar from "components/Scrollbar";
import SearchArea from "components/dashboard/SearchArea";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import AdminDashboardLayout from "components/layouts/admin-dashboard";
import useMuiTable from "hooks/useMuiTable";
import { OrderRow } from "pages-sections/admin";
import api from "utils/__api__/dashboard";
// TABLE HEADING DATA LIST
const tableHeading = [{
  id: "id",
  label: "주문 번호",
  align: "left"
}, {
  id: "qty",
  label: "수량",
  align: "left"
}, {
  id: "purchaseDate",
  label: "구매날짜",
  align: "left"
}, {
  id: "billingAddress",
  label: "수수료율",
  align: "left"
}, {
  id: "amount",
  label: "금액",
  align: "left"
}, {
  id: "status",
  label: "처리 상태",
  align: "left"
}, {
  id: "action",
  label: "수정/삭제",
  align: "center"
}];

// =============================================================================
OrderList.getLayout = function getLayout(page) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
// =============================================================================

// =============================================================================

export default function OrderList({
  orders
}) {
  // RESHAPE THE ORDER LIST BASED TABLE HEAD CELL ID
  const filteredOrders = orders.map(item => ({
    id: item.id,
    qty: item.items.length,
    purchaseDate: item.createdAt,
    billingAddress: item.shippingAddress,
    amount: item.totalPrice,
    status: item.status
  }));
  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: filteredOrders,
    defaultSort: "purchaseDate",
    defaultOrder: "desc"
  });
  return <Box py={4}>
      <H3 mb={2}>주문내역</H3>

      <SearchArea handleSearch={() => {}} buttonText="주문 생성" handleBtnClick={() => {}} searchPlaceholder="주문내역 검색" />

      <Card>
        <Scrollbar>
          <TableContainer sx={{
          minWidth: 900
        }}>
            <Table>
              <TableHeader order={order} hideSelectBtn orderBy={orderBy} heading={tableHeading} numSelected={selected.length} rowCount={filteredList.length} onRequestSort={handleRequestSort} />

              <TableBody>
                {filteredList.map(order => <OrderRow order={order} key={order.id} />)}
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
  const orders = await api.orders();
  return {
    props: {
      orders
    }
  };
};