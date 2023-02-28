import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import AdminDashboardLayout from "components/layouts/admin-dashboard";
import Scrollbar from "components/Scrollbar";
import { H3 } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import { ReviewRow } from "pages-sections/admin";
import api from "utils/__api__/dashboard";
// TABLE HEADING DATA LIST
const tableHeading = [{
  id: "product",
  label: "제품",
  align: "left"
}, {
  id: "customer",
  label: "고객",
  align: "left"
}, {
  id: "comment",
  label: "후기",
  align: "left"
}, {
  id: "published",
  label: "공개 여부",
  align: "left"
}, {
  id: "action",
  label: "수정/삭제",
  align: "center"
}];

// =============================================================================
ProductReviews.getLayout = function getLayout(page) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
// =============================================================================

// =============================================================================

export default function ProductReviews({
  reviews
}) {
  // RESHAPE THE REVIEW LIST BASED TABLE HEAD CELL ID
  const filteredrReviews = reviews.map(item => ({
    id: item.id,
    published: true,
    comment: item.comment,
    productId: item.product.id,
    product: item.product.title,
    productImage: item.product.thumbnail,
    customer: `${item.customer.name.firstName} ${item.customer.name.lastName}`
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
    listData: filteredrReviews,
    defaultSort: "product"
  });
  return <Box py={4}>
      <H3 mb={2}>상품 후기</H3>

      <Card>
        <Scrollbar>
          <TableContainer sx={{
          minWidth: 1000
        }}>
            <Table>
              <TableHeader order={order} hideSelectBtn orderBy={orderBy} heading={tableHeading} numSelected={selected.length} rowCount={filteredList.length} onRequestSort={handleRequestSort} />

              <TableBody>
                {filteredList.map(review => <ReviewRow review={review} key={review.id} />)}
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
  const reviews = await api.reviews();
  return {
    props: {
      reviews
    }
  };
};