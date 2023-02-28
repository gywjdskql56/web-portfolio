import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import SearchArea from "components/dashboard/SearchArea";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import AdminDashboardLayout from "components/layouts/admin-dashboard";
import { H3 } from "components/Typography";
import Scrollbar from "components/Scrollbar";
import useMuiTable from "hooks/useMuiTable";
import { SellerRow } from "pages-sections/admin";
import api from "utils/__api__/dashboard";

// table column list
const tableHeading = [{
  id: "name",
  label: "판매자 이름",
  align: "left"
}, {
  id: "shopName",
  label: "판매자 회사",
  align: "left"
}, {
  id: "package",
  label: "등급",
  align: "left"
}, {
  id: "balance",
  label: "최근 매출",
  align: "left"
}, {
  id: "published",
  label: "판매사 공개",
  align: "left"
}, {
  id: "action",
  label: "수정/삭제",
  align: "center"
}];

// =============================================================================
SellerList.getLayout = function getLayout(page) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
// =============================================================================

// =============================================================================

export default function SellerList({
  sellers
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
    listData: sellers
  });
  return <Box py={4}>
      <H3 mb={2}>판매자</H3>

      <SearchArea handleSearch={() => {}} buttonText="새로운 판매자 등록" handleBtnClick={() => {}} searchPlaceholder="판매자 검색" />

      <Card>
        <Scrollbar>
          <TableContainer sx={{
          minWidth: 1100
        }}>
            <Table>
              <TableHeader order={order} hideSelectBtn orderBy={orderBy} heading={tableHeading} rowCount={sellers.length} numSelected={selected.length} onRequestSort={handleRequestSort} />

              <TableBody>
                {filteredList.map((seller, index) => <SellerRow seller={seller} key={index} />)}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination onChange={handleChangePage} count={Math.ceil(sellers.length / rowsPerPage)} />
        </Stack>
      </Card>
    </Box>;
}
export const getStaticProps = async () => {
  const sellers = await api.sellers();
  return {
    props: {
      sellers
    }
  };
};