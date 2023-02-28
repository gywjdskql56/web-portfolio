import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import { H3 } from "components/Typography";
import Scrollbar from "components/Scrollbar";
import SearchArea from "components/dashboard/SearchArea";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import AdminDashboardLayout from "components/layouts/admin-dashboard";
import useMuiTable from "hooks/useMuiTable";
import { CustomerRow } from "pages-sections/admin";
import api from "utils/__api__/dashboard";

// table column list
const tableHeading = [{
  id: "name",
  label: "성함",
  align: "left"
}, {
  id: "phone",
  label: "휴대폰 번호",
  align: "left"
}, {
  id: "email",
  label: "이메일",
  align: "left"
}, {
  id: "balance",
  label: "포인트",
  align: "left"
}, {
  id: "orders",
  label: "주문 수",
  align: "left"
}, {
  id: "action",
  label: "수정/삭제",
  align: "center"
}];

// =============================================================================
CustomerList.getLayout = function getLayout(page) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
// =============================================================================

// =============================================================================

export default function CustomerList({
  customers
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
    listData: customers
  });
  return <Box py={4}>
      <H3 mb={2}>회원 리스트</H3>

      <SearchArea handleSearch={() => {}} buttonText="회원 추가" handleBtnClick={() => {}} searchPlaceholder="회원 검색" />

      <Card>
        <Scrollbar>
          <TableContainer sx={{
          minWidth: 900
        }}>
            <Table>
              <TableHeader order={order} hideSelectBtn orderBy={orderBy} heading={tableHeading} numSelected={selected.length} rowCount={filteredList.length} onRequestSort={handleRequestSort} />

              <TableBody>
                {filteredList.map(customer => <CustomerRow customer={customer} key={customer.id} />)}
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
  const customers = await api.customers();
  return {
    props: {
      customers
    }
  };
};