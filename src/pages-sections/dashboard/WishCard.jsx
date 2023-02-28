import NextImage from "next/image";
import { Box, Card } from "@mui/material";
import { H3, H5, Paragraph } from "components/Typography";
import { currency } from "lib";
const WishCard = () => {
  return <Card sx={{
    p: 3,
    height: "100%",
    display: "flex",
    position: "relative",
    flexDirection: "column",
    justifyContent: "center"
  }}>
      <H5 color="info.main" mb={0.5}>
        안녕하세요, 관리자님!
      </H5>
      <Paragraph color="grey.600">
        웹사이트 전체 현황 페이지입니다.
      </Paragraph>

      <H3 mt={3}>15,350.25</H3>
      <Paragraph color="grey.600">오늘의 방문자수</Paragraph>

      <H3 mt={1.5}>{currency(10360.66)}</H3>
      <Paragraph color="grey.600">오늘의 전체 판매금액</Paragraph>

      <Box sx={{
      right: 24,
      bottom: 0,
      position: "absolute",
      display: {
        xs: "none",
        sm: "block"
      }
    }}>
        <NextImage src="/assets/images/illustrations/dashboard/welcome.svg" width={195} height={171} alt="Welcome" />
      </Box>
    </Card>;
};
export default WishCard;