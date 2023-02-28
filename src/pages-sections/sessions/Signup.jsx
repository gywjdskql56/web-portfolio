import { useCallback, useState } from "react";
import { Button, Checkbox, Box, FormControlLabel } from "@mui/material";
import Link from "next/link";
import * as yup from "yup";
import { useFormik } from "formik";
import { FlexBox, FlexRowCenter } from "components/flex-box";
import { H1, H6 } from "components/Typography";
import BazaarImage from "components/BazaarImage";
import BazaarTextField from "components/BazaarTextField";
import { Wrapper } from "./Login";
import SocialButtons from "./SocialButtons";
import EyeToggleButton from "./EyeToggleButton";
const Signup = () => {
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
        <BazaarImage src="/assets/images/bazaar-black-sm.svg" sx={{
        m: "auto"
      }} />

        <H1 textAlign="center" mt={1} mb={4} fontSize={16}>
          회원가입하기
        </H1>

        <BazaarTextField mb={1.5} fullWidth name="name" size="small" label="이름" variant="outlined" onBlur={handleBlur} value={values.name} onChange={handleChange} placeholder="정지윤" error={!!touched.name && !!errors.name} helperText={touched.name && errors.name} />

        <BazaarTextField mb={1.5} fullWidth name="email" size="small" type="email" variant="outlined" onBlur={handleBlur} value={values.email} onChange={handleChange} label="이메일 혹은 전화번호" placeholder="exmple@mail.com" error={!!touched.email && !!errors.email} helperText={touched.email && errors.email} />

        <BazaarTextField mb={1.5} fullWidth size="small" name="password" label="비밀번호" variant="outlined" autoComplete="on" placeholder="*********" onBlur={handleBlur} onChange={handleChange} value={values.password} type={passwordVisibility ? "text" : "password"} error={!!touched.password && !!errors.password} helperText={touched.password && errors.password} InputProps={{
        endAdornment: <EyeToggleButton show={passwordVisibility} click={togglePasswordVisibility} />
      }} />

        <BazaarTextField fullWidth size="small" autoComplete="on" name="re_password" variant="outlined" label="비밀번호 확인" placeholder="*********" onBlur={handleBlur} onChange={handleChange} value={values.re_password} type={passwordVisibility ? "text" : "password"} error={!!touched.re_password && !!errors.re_password} helperText={touched.re_password && errors.re_password} InputProps={{
        endAdornment: <EyeToggleButton show={passwordVisibility} click={togglePasswordVisibility} />
      }} />

        <FormControlLabel name="agreement" className="agreement" onChange={handleChange} control={<Checkbox size="small" color="secondary" checked={values.agreement || false} />} label={<FlexBox flexWrap="wrap" alignItems="center" justifyContent="flex-start">
              회원가입을 위해 다음
              <a href="/" target="_blank" rel="noreferrer noopener">
                <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">
                  약관
                </H6>
              </a>
              에 동의해주세요.
            </FlexBox>} />

        <Button fullWidth type="submit" color="primary" variant="contained" sx={{
        height: 44
      }}>
          회원가입하기
        </Button>
      </form>

      <SocialButtons />
      <FlexRowCenter mt="1.25rem">
        <Box>이미 계정을 가지고 계신가요?</Box>
        <Link href="/login" passHref legacyBehavior>
          <a>
            <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">
              로그인하기
            </H6>
          </a>
        </Link>
      </FlexRowCenter>
    </Wrapper>;
};
const initialValues = {
  name: "",
  email: "",
  password: "",
  re_password: "",
  agreement: false
};
const formSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  re_password: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Please re-type password"),
  agreement: yup.bool().test("agreement", "You have to agree with our Terms and Conditions!", value => value === true).required("You have to agree with our Terms and Conditions!")
});
export default Signup;