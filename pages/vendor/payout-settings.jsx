import * as Yup from "yup";
import { Formik } from "formik";
import { Box, Button, Card, Divider, Stack, TextField } from "@mui/material";
import { H3, Paragraph } from "components/Typography";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
const cardInitialValues = {
  amount: "$250",
  cardCvc: "255",
  cardNo: "12345678910",
  cardHolderName: "Gage Paquette"
};
const accountInitialValues = {
  amount: "$250",
  routingNo: "255",
  accountNo: "12345678910",
  accountHolderName: "Gage Paquette"
};
const validationSchema = Yup.object().shape({
  cardCvc: Yup.number().required("Card CVC is required!"),
  amount: Yup.string().required("Amount is required!"),
  cardNo: Yup.string().required("Card No is required!"),
  cardHolderName: Yup.string().required("Card Holder Name is required!")
});
const accountValidateSchema = Yup.object().shape({
  routingNo: Yup.number().required("Routing No is required!"),
  amount: Yup.string().required("Amount is required!"),
  accountNo: Yup.string().required("Account No is required!"),
  accountHolderName: Yup.string().required("Acc. Holder Name is required!")
});

// =============================================================================
PayoutSettings.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

export default function PayoutSettings() {
  // pay via card form handler
  const handleCardPaymentSubmit = values => {};
  // pay via bank account form handler
  const handleAccountPaymentSubmit = values => {};
  return <Box py={4} maxWidth={740} margin="auto">
      <H3 mb={2}>대금결제 설정</H3>

      <Card sx={{
      p: 3
    }}>
        <Paragraph fontWeight={700} mb={4}>
          현금 지불
        </Paragraph>

        <TextField fullWidth color="info" size="medium" name="amount" label="금액" defaultValue="$250" sx={{
        mb: 3
      }} />

        <Button type="submit" color="info" variant="contained">
          저장
        </Button>

        <Divider sx={{
        my: 4
      }} />

        <Paragraph fontWeight={700} mb={4}>
          카드 지불
        </Paragraph>

        <Formik initialValues={cardInitialValues} onSubmit={handleCardPaymentSubmit} validationSchema={validationSchema}>
          {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit
        }) => <form onSubmit={handleSubmit}>
              <Stack spacing={3} mb={3}>
                <TextField color="info" size="medium" name="amount" label="금액" onBlur={handleBlur} value={values.amount} onChange={handleChange} error={Boolean(errors.amount && touched.amount)} helperText={touched.amount && errors.amount} />

                <TextField color="info" size="medium" onBlur={handleBlur} name="cardHolderName" onChange={handleChange} label="카드 소유주" value={values.cardHolderName} error={Boolean(errors.cardHolderName && touched.cardHolderName)} helperText={touched.cardHolderName && errors.cardHolderName} />

                <TextField color="info" size="medium" name="cardNo" label="카드 번호" onBlur={handleBlur} value={values.cardNo} onChange={handleChange} error={Boolean(errors.cardNo && touched.cardNo)} helperText={touched.cardNo && errors.cardNo} />

                <TextField color="info" size="medium" name="cardCvc" label="카드 CVC" onBlur={handleBlur} value={values.cardCvc} onChange={handleChange} error={Boolean(errors.cardCvc && touched.cardCvc)} helperText={touched.cardCvc && errors.cardCvc} />
              </Stack>

              <Button type="submit" color="info" variant="contained">
                저장
              </Button>
            </form>}
        </Formik>

        <Divider sx={{
        my: 4
      }} />

        <Paragraph fontWeight={700} mb={4}>
          계좌 지불
        </Paragraph>

        <Formik initialValues={accountInitialValues} onSubmit={handleAccountPaymentSubmit} validationSchema={accountValidateSchema}>
          {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit
        }) => <form onSubmit={handleSubmit}>
              <Stack spacing={3} mb={3}>
                <TextField color="info" size="medium" name="amount" label="금액" onBlur={handleBlur} value={values.amount} onChange={handleChange} error={Boolean(errors.amount && touched.amount)} helperText={touched.amount && errors.amount} />

                <TextField color="info" size="medium" onBlur={handleBlur} onChange={handleChange} name="accountHolderName" label="계좌 소유주" value={values.accountHolderName} error={Boolean(errors.accountHolderName && touched.accountHolderName)} helperText={touched.accountHolderName && errors.accountHolderName} />

                <TextField color="info" size="medium" name="accountNo" label="계좌번호" onBlur={handleBlur} onChange={handleChange} value={values.accountNo} error={Boolean(errors.accountNo && touched.accountNo)} helperText={touched.accountNo && errors.accountNo} />

                <TextField color="info" size="medium" name="routingNo" label="라우팅 숫자" onBlur={handleBlur} onChange={handleChange} value={values.routingNo} error={Boolean(errors.routingNo && touched.routingNo)} helperText={touched.routingNo && errors.routingNo} />
              </Stack>

              <Button type="submit" color="info" variant="contained">
                저장
              </Button>
            </form>}
        </Formik>
      </Card>
    </Box>;
}