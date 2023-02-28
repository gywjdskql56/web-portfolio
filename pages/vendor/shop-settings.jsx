import { useState } from "react";
import { Delete } from "@mui/icons-material";
import { Box, Button, Card, Divider, IconButton, MenuItem, Stack, TextField } from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import DropZone from "components/DropZone";
import { FlexBox } from "components/flex-box";
import { H3, Paragraph } from "components/Typography";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
const INITIAL_VALUES = {
  order: 10,
  category: "임플란트",
  shopName: "모두투어",
  shopPhone: "+123 4567 8910",
  shopAddress: "서울특별시 강남구 테헤란로 123-21, 203호",
  description: `한국 임플란트 시술 1위인 석플란트 병원에서 일주일간 집중 치료를 받을 수 있는 상품입니다.`
};
const validationSchema = Yup.object().shape({
  shopName: Yup.string().required("Shop Name is required!"),
  shopPhone: Yup.string().required("Shop Phone is required!"),
  category: Yup.string().required("Category is required!"),
  description: Yup.string().required("Description is required!"),
  shopAddress: Yup.string().required("Shop Address is required!"),
  order: Yup.number().required("Orders is required!")
});

// =============================================================================
ShopSettings.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

export default function ShopSettings() {
  const [links, setLinks] = useState([{
    id: 1,
    name: "Links",
    value: "https://www.productbanner.com"
  }]);
  const handleAddLink = () => {
    const newLink = {
      id: Date.now(),
      name: "Links",
      value: "https://www.google.com"
    };
    setLinks(state => [...state, newLink]);
  };
  const handleDeleteLink = id => () => {
    setLinks(state => state.filter(item => item.id !== id));
  };
  const handleFormSubmit = values => {};
  return <Box py={4} maxWidth={740} margin="auto">
      <H3 mb={2}>판매사 설정</H3>

      <Card sx={{
      p: 3
    }}>
        <Paragraph fontWeight={700} mb={4}>
          기본 설정
        </Paragraph>

        <Formik onSubmit={handleFormSubmit} initialValues={INITIAL_VALUES} validationSchema={validationSchema}>
          {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit
        }) => <form onSubmit={handleSubmit}>
              <Stack spacing={3} mb={3}>
                <TextField color="info" size="medium" name="shopName" label="판매사 *" onBlur={handleBlur} value={values.shopName} onChange={handleChange} error={Boolean(errors.shopName && touched.shopName)} helperText={touched.shopName && errors.shopName} />

                <TextField color="info" size="medium" name="shopPhone" label="판매사 번호" onBlur={handleBlur} onChange={handleChange} value={values.shopPhone} error={Boolean(errors.shopPhone && touched.shopPhone)} helperText={touched.shopPhone && errors.shopPhone} />

                <TextField select fullWidth color="info" size="medium" name="category" onBlur={handleBlur} placeholder="카테고리" label="카테고리 선택" onChange={handleChange} value={values.category} error={Boolean(errors.category && touched.category)} helperText={touched.category && errors.category}>
                  <MenuItem value="electronics">임플란트</MenuItem>
                  <MenuItem value="fashion">피부과</MenuItem>
                </TextField>

                <TextField rows={6} multiline fullWidth color="info" size="medium" name="description" onBlur={handleBlur} onChange={handleChange} value={values.description} label="설명(선택)" error={Boolean(errors.description && touched.description)} helperText={touched.description && errors.description} />

                <TextField color="info" size="medium" name="shopAddress" label="판매사 주소" onBlur={handleBlur} onChange={handleChange} value={values.shopAddress} error={Boolean(errors.shopAddress && touched.shopAddress)} helperText={touched.shopAddress && errors.shopAddress} />

                <TextField name="order" color="info" size="medium" type="number" onBlur={handleBlur} value={values.order} label="최소주문수량 *" onChange={handleChange} error={Boolean(errors.order && touched.order)} helperText={touched.order && errors.order} />
              </Stack>

              <Button type="submit" color="info" variant="contained">
                저장
              </Button>
            </form>}
        </Formik>

        <Divider sx={{
        my: 4
      }} />

        <Paragraph fontWeight={700} mb={2}>
          판매사 페이지 관리
        </Paragraph>

        <Stack spacing={3} mb={3}>
          <DropZone onChange={files => console.log(files)} title="메인 배너 (1920 x 360) *" imageSize="높이에 제한이 있습니다. 특정화면에서 이미지의 높이가 짤릴 수 있습니다." />

          <TextField select fullWidth color="info" size="medium" name="features" placeholder="상품 특성" label="Product Features" defaultValue="electronics">
                <MenuItem value="electronics">임플란트</MenuItem>
                <MenuItem value="fashion">피부과</MenuItem>
          </TextField>

          <DropZone onChange={files => console.log(files)} title="모든 상품 공통 배너 * (추천사이즈 1025x120)" imageSize="높이에 제한이 있습니다. 특정화면에서 이미지의 높이가 짤릴 수 있습니다." />
        </Stack>

        <Box mb={4}>
          {links.map(item => <FlexBox gap={2} alignItems="center" mb={2} key={item.id}>
              <TextField fullWidth color="info" size="medium" label="링크" defaultValue={item.value} />

              <Box flexShrink={0}>
                <IconButton onClick={handleDeleteLink(item.id)}>
                  <Delete sx={{
                color: "grey.600"
              }} />
                </IconButton>
              </Box>
            </FlexBox>)}

          <Button color="info" variant="outlined" onClick={handleAddLink}>
            링크 추가
          </Button>
        </Box>

        <Button color="info" variant="contained">
          저장
        </Button>
      </Card>
    </Box>;
}