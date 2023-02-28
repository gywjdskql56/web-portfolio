import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import { CategoryForm } from "pages-sections/admin";
import AdminDashboardLayout from "components/layouts/admin-dashboard";
// import api from "utils/__api__/products";

// =============================================================================
CreateCategory.getLayout = function getLayout(page) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
// =============================================================================

export default function CreateCategory() {
  const INITIAL_VALUES = {
    name: "",
    parent: [],
    featured: false
  };

  // form field validation schema
  const validationSchema = yup.object().shape({
    name: yup.string().required("required")
  });
  const handleFormSubmit = () => {};
  return <Box py={4}>
      <H3 mb={2}>카테고리 추가</H3>

      <CategoryForm initialValues={INITIAL_VALUES} validationSchema={validationSchema} handleFormSubmit={handleFormSubmit} />
    </Box>;
}