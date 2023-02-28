import { useCallback, useState } from "react";
import { Button, Card, Box, styled } from "@mui/material";
import Link from "next/link";
import * as yup from "yup";
import { useFormik } from "formik";
import { H1, H6 } from "components/Typography";
import BazaarImage from "components/BazaarImage";
import BazaarTextField from "components/BazaarTextField";
import SocialButtons from "./SocialButtons";
import EyeToggleButton from "./EyeToggleButton";
import { FlexBox, FlexRowCenter } from "components/flex-box";
const fbStyle = {
  background: "#3B5998",
  color: "white"
};
const googleStyle = {
  background: "#4285F4",
  color: "white"
};
export const Wrapper = styled(({
  children,
  passwordVisibility,
  ...rest
}) => <Card {...rest}>{children}</Card>)(({
  theme,
  passwordVisibility
}) => ({
  width: 500,
  padding: "2rem 3rem",
  [theme.breakpoints.down("sm")]: {
    width: "100%"
  },
  ".passwordEye": {
    color: passwordVisibility ? theme.palette.grey[600] : theme.palette.grey[400]
  },
  ".facebookButton": {
    marginBottom: 10,
    ...fbStyle,
    "&:hover": fbStyle
  },
  ".googleButton": {
    ...googleStyle,
    "&:hover": googleStyle
  },
  ".agreement": {
    marginTop: 12,
    marginBottom: 24
  }
}));
const Login = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility(visible => !visible);
  }, []);
  const handleFormSubmit = async values => {
    console.log(values);
  };
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit
  } = useFormik({
    initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: formSchema
  });
  return <Wrapper elevation={3} passwordVisibility={passwordVisibility}>
      <form onSubmit={handleSubmit}>
        <BazaarImage height={44} src="/assets/images/magi_logo.png" sx={{
        m: 1
      }} />

        <H1 textAlign="center" mt={1} mb={4} fontSize={16}>
          미래에셋 포트폴리오 자문 시스템
        </H1>

        <BazaarTextField mb={1.5} fullWidth name="email" size="small" type="email" variant="outlined" onBlur={handleBlur} value={values.email} onChange={handleChange} label="이메일 또는 전화번호" placeholder="exmple@mail.com / 010-0000-0000(-은 제외)" error={!!touched.email && !!errors.email} helperText={touched.email && errors.email} />

        <BazaarTextField mb={2} fullWidth size="small" name="password" label="비밀번호" autoComplete="on" variant="outlined" onBlur={handleBlur} onChange={handleChange} value={values.password} placeholder="*********" type={passwordVisibility ? "text" : "password"} error={!!touched.password && !!errors.password} helperText={touched.password && errors.password} InputProps={{
        endAdornment: <EyeToggleButton show={passwordVisibility} click={togglePasswordVisibility} />
      }} />

        <Button fullWidth href="/market-1" type="submit" color="info" variant="contained" sx={{
        height: 44
      }}>
          로그인
        </Button>
      </form>

{/*     <SocialButtons /> */}

      <FlexRowCenter mt="1.25rem">
        <Box>아직 계정이 없으신가요?</Box>
        <Link href="/signup" passHref legacyBehavior>
          <a>
            <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">
              회원가입
            </H6>
          </a>
        </Link>
      </FlexRowCenter>

      <FlexBox justifyContent="center" bgcolor="grey.200" borderRadius="4px" py={2.5} mt="1.25rem">
        비밀번호를 잊으셨나요?
        <Link href="/reset-password" passHref legacyBehavior>
          <a>
            <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">
              비밀번호 초기화
            </H6>
          </a>
        </Link>
      </FlexBox>
    </Wrapper>;
};
const initialValues = {
  email: "",
  password: ""
};
const formSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
  email: yup.string().email("invalid email").required("Email is required")
});
export default Login;