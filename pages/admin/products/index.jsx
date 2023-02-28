import Router from "next/router";
import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import SearchArea from "components/dashboard/SearchArea";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import AdminDashboardLayout from "components/layouts/admin-dashboard";
import { H3 } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import Scrollbar from "components/Scrollbar";
import { ProductRow } from "pages-sections/admin";
import api from "utils/__api__/dashboard";
// TABLE HEADING DATA LIST
const tableHeading = [{
  id: "name",
  label: "상품명",
  align: "left"
}, {
  id: "category",
  label: "카테고리",
  align: "left"
}, {
  id: "brand",
  label: "판매사",
  align: "left"
}, {
  id: "price",
  label: "가격",
  align: "left"
}, {
  id: "published",
  label: "공개여부",
  align: "left"
}, {
  id: "action",
  label: "수정 및 삭제",
  align: "center"
}];

// =============================================================================
ProductList.getLayout = function getLayout(page) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
// =============================================================================

// =============================================================================

export default function ProductList(props) {
  const {
    products
  } = props;

  // RESHAPE THE PRODUCT LIST BASED TABLE HEAD CELL ID
  const filteredProducts = products.map(item => ({
    id: item.id,
    slug: item.slug,
    name: item.title,
    brand: item.brand,
    price: item.price,
    image: item.thumbnail,
    published: item.published,
    category: item.categories[0]
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
    listData: filteredProducts
  });
  return <Box py={4}>
      <H3 mb={2}>상품 리스트</H3>

      <SearchArea handleSearch={() => {}} buttonText="상품 추가하기" searchPlaceholder="상품 검색하기..." handleBtnClick={() => Router.push("/admin/products/create")} />

      <Card>
        <Scrollbar autoHide={false}>
          <TableContainer sx={{
          minWidth: 900
        }}>
            <Table>
              <TableHeader order={order} hideSelectBtn orderBy={orderBy} heading={tableHeading} rowCount={products.length} numSelected={selected.length} onRequestSort={handleRequestSort} />

              <TableBody>
                {filteredList.map((product, index) => <ProductRow product={product} key={index} />)}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination onChange={handleChangePage} count={Math.ceil(products.length / rowsPerPage)} />
        </Stack>
      </Card>
    </Box>;
}
export const getStaticProps = async () => {
  const products = await api.products();
  return {
    props: {
      products
    }
  };
};