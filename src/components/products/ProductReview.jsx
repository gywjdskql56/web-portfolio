import { Box, Button, TextField, Rating } from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";
import { FlexBox } from "components/flex-box";
import ProductComment from "./ProductComment";
import { H2, H5 } from "components/Typography";

// ===================================================

// ===================================================

const ProductReview = () => {
  const handleFormSubmit = async (values, {
    resetForm
  }) => {
    resetForm();
  };
  const {
    dirty,
    values,
    errors,
    touched,
    isValid,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue
  } = useFormik({
    onSubmit: handleFormSubmit,
    initialValues: initialValues,
    validationSchema: reviewSchema
  });
  return <Box>
      {commentList.map((item, ind) => <ProductComment {...item} key={ind} />)}

      <H2 fontWeight="600" mt={7} mb={2.5}>
        상품에 대한 후기를 알려주세요.
      </H2>

      <form onSubmit={handleSubmit}>
        <Box mb={2.5}>
          <FlexBox mb={1.5} gap={0.5}>
            <H5 color="grey.700">서비스 만족도</H5>
            <H5 color="error.main">*</H5>
          </FlexBox>

          <Rating color="warn" size="medium" value={values.rating} onChange={(_, value) => setFieldValue("rating", value)} />
        </Box>

        <Box mb={3}>
          <FlexBox mb={1.5} gap={0.5}>
            <H5 color="grey.700">리뷰 작성하기</H5>
            <H5 color="error.main">*</H5>
          </FlexBox>

          <TextField rows={8} multiline fullWidth name="comment" variant="outlined" onBlur={handleBlur} value={values.comment} onChange={handleChange} placeholder="상세한 후기를 남겨주시면 다른 분들에게 도움이 돼요!" error={!!touched.comment && !!errors.comment} helperText={touched.comment && errors.comment} />
        </Box>

        <Button variant="contained" color="primary" type="submit" disabled={!(dirty && isValid)}>
          저장
        </Button>
      </form>
    </Box>;
};
const commentList = [{
  name: "정지여",
  imgUrl: "/assets/images/faces/img.png",
  rating: 5,
  date: "2021-02-14",
  comment: "너무 편하고 좋았습니다. 수술도 정말 잘되었고 덕분에 한국에서의 추억이 좋게 남았어요"
}, {
  name: "정지남",
  imgUrl: "/assets/images/faces/img_1.png",
  rating: 5,
  date: "2019-08-10",
  comment: "병원 시설이 매우 좋아서 입원하는 동안 만족스러웠어요. 교수님들이 친절하시고 자세히 안내해주셔서 생각보다 무섭지는 않았습니다"
}, {
  name: "정지돌",
  imgUrl: "/assets/images/faces/img_2.png",
  rating: 5,
  date: "2021-02-05",
  comment: "호텔이 생각보다 작긴했지만 혼자 지내기에는 충분했고 주변에 먹을게 많았어요. 생각보다 덜아파서 재밌게 돌아다니다가 왔습니다."
}];
const initialValues = {
  rating: 0,
  comment: "",
  date: new Date().toISOString()
};
const reviewSchema = yup.object().shape({
  rating: yup.number().required("required"),
  comment: yup.string().required("required")
});
export default ProductReview;