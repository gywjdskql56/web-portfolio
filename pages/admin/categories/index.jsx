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
import { CategoryRow } from "pages-sections/admin";
import api from "utils/__api__/dashboard";

// TABLE HEADING DATA LIST
const tableHeading = [{
  id: "id",
  label: "카테고리 코드",
  align: "left"
}, {
  id: "name",
  label: "카테고리명",
  align: "left"
}, {
  id: "image",
  label: "이미지",
  align: "left"
}, {
  id: "level",
  label: "카테고리 단계",
  align: "left"
}, {
  id: "featured",
  label: "공개 여부",
  align: "left"
}, {
  id: "action",
  label: "수정/편집",
  align: "center"
}];

// =============================================================================
CategoryList.getLayout = function getLayout(page) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
// =============================================================================

// =============================================================================

export default function CategoryList(props) {
  const {
    categories
  } = props;

  // RESHAPE THE PRODUCT LIST BASED TABLE HEAD CELL ID
  const filteredCategories = categories.map(item => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    image: item.image,
    featured: item.featured,
    level: Math.ceil(Math.random() * 1)
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
    listData: filteredCategories
  });
  return <Box py={4}>
      <H3 mb={2}>상품 카테고리</H3>

      <SearchArea handleSearch={() => {}} buttonText="카테고리 추가" searchPlaceholder="카테고리 검색" handleBtnClick={() => Router.push("/admin/categories/create")} />

      <Card>
        <Scrollbar>
          <TableContainer sx={{
          minWidth: 900
        }}>
            <Table>
              <TableHeader order={order} hideSelectBtn orderBy={orderBy} heading={tableHeading} rowCount={categories.length} numSelected={selected.length} onRequestSort={handleRequestSort} />

              <TableBody>
                {filteredList.map(category => <CategoryRow item={category} key={category.id} selected={selected} />)}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination onChange={handleChangePage} count={Math.ceil(categories.length / rowsPerPage)} />
        </Stack>
      </Card>
    </Box>;
}
export const getStaticProps = async () => {
  const categories = await api.category();
  return {
    props: {
      categories
    }
  };
};