import { Fragment } from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { Done, ShoppingBag } from "@mui/icons-material";
import { Avatar, Box, Button, Card, Divider, Grid, Typography, styled } from "@mui/material";
import TableRow from "components/TableRow";
import Delivery from "components/icons/Delivery";
import PackageBox from "components/icons/PackageBox";
import TruckFilled from "components/icons/TruckFilled";
import { H5, H6, Paragraph } from "components/Typography";
import { FlexBetween, FlexBox } from "components/flex-box";
import UserDashboardHeader from "components/header/UserDashboardHeader";
import CustomerDashboardLayout from "components/layouts/customer-dashboard";
import CustomerDashboardNavigation from "components/layouts/customer-dashboard/Navigations";
import useWindowSize from "hooks/useWindowSize";
import { currency } from "lib";
import api from "utils/__api__/orders";

// styled components
const StyledFlexbox = styled(FlexBetween)(({
  theme
}) => ({
  flexWrap: "wrap",
  marginTop: "2rem",
  marginBottom: "2rem",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column"
  },
  "& .line": {
    height: 4,
    minWidth: 50,
    flex: "1 1 0",
    [theme.breakpoints.down("sm")]: {
      flex: "unset",
      height: 50,
      minWidth: 4
    }
  }
}));
// =============================================================

const OrderDetails = ({
  order
}) => {
  const router = useRouter();
  const width = useWindowSize();
  const orderStatus = "Shipping";
  const orderStatusList = ["Packaging", "Shipping", "Delivering", "Complete"];
  const stepIconList = [PackageBox, TruckFilled, Delivery];
  const breakpoint = 350;
  const statusIndex = orderStatusList.indexOf(orderStatus);

  // SECTION TITLE HEADER
  const HEADER_BUTTON = <Button color="primary" sx={{
    bgcolor: "primary.light",
    px: 4
  }}>
      재주문하기
    </Button>;

  // Show a loading state when the fallback is rendered
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }
  return <CustomerDashboardLayout>
      {/* TITLE HEADER AREA */}
      <UserDashboardHeader icon={ShoppingBag} title="주문 상세" navigation={<CustomerDashboardNavigation />} button={HEADER_BUTTON} />

      {/* ORDER PROGRESS AREA */}
      <Card sx={{
      p: "2rem 1.5rem",
      mb: "30px"
    }}>
        <StyledFlexbox>
          {stepIconList.map((Icon, ind) => <Fragment key={ind}>
              <Box position="relative">
                <Avatar sx={{
              width: 64,
              height: 64,
              bgcolor: ind <= statusIndex ? "primary.main" : "grey.300",
              color: ind <= statusIndex ? "grey.white" : "primary.main"
            }}>
                  <Icon color="inherit" sx={{
                fontSize: "32px"
              }} />
                </Avatar>

                {ind < statusIndex && <Box position="absolute" right="0" top="0">
                    <Avatar sx={{
                width: 22,
                height: 22,
                bgcolor: "grey.200",
                color: "success.main"
              }}>
                      <Done color="inherit" sx={{
                  fontSize: "1rem"
                }} />
                    </Avatar>
                  </Box>}
              </Box>

              {ind < stepIconList.length - 1 && <Box className="line" bgcolor={ind < statusIndex ? "primary.main" : "grey.300"} />}
            </Fragment>)}
        </StyledFlexbox>

        <FlexBox justifyContent={width < breakpoint ? "center" : "flex-end"}>
          <Typography p="0.5rem 1rem" textAlign="center" borderRadius="300px" color="primary.main" bgcolor="primary.light">
             <b>4일 뒤에</b> 예약확정 예정입니다.
          </Typography>
        </FlexBox>
      </Card>

      {/* ORDERED PRODUCT LIST */}
      <Card sx={{
      p: 0,
      mb: "30px"
    }}>
        <TableRow sx={{
        p: "12px",
        borderRadius: 0,
        boxShadow: "none",
        bgcolor: "grey.200"
      }}>
          <FlexBox className="pre" m={0.75} alignItems="center">
            <Typography fontSize={14} color="grey.600" mr={0.5}>
              주문 고유번호:
            </Typography>

            <Typography fontSize={14}>{order.id}</Typography>
          </FlexBox>

          <FlexBox className="pre" m={0.75} alignItems="center">
            <Typography fontSize={14} color="grey.600" mr={0.5}>
              주문 일시:
            </Typography>

            <Typography fontSize={14}>
              {format(new Date(order.createdAt), "yyyy-MM-dd")}
            </Typography>
          </FlexBox>

          <FlexBox className="pre" m={0.75} alignItems="center">
            <Typography fontSize={14} color="grey.600" mr={0.5}>
              도착 예정:
            </Typography>

            <Typography fontSize={14}>
              {format(new Date(), "yyyy-MM-dd")}
            </Typography>
          </FlexBox>
        </TableRow>

        <Box py={1}>
          {order.items.map((item, ind) => <FlexBox px={2} py={1} flexWrap="wrap" alignItems="center" key={ind}>
              <FlexBox flex="2 2 260px" m={0.75} alignItems="center">
                <Avatar src={item.product_img} sx={{
              height: 64,
              width: 64
            }} />
                <Box ml={2.5}>
                  <H6 my="0px">{item.product_name}</H6>

                  <Typography fontSize="14px" color="grey.600">
                    {currency(item.product_price)} x {item.product_quantity}
                  </Typography>
                </Box>
              </FlexBox>

              <FlexBox flex="1 1 260px" m={0.75} alignItems="center">
                <Typography fontSize="14px" color="grey.600">
                  상품 옵션: 비즈니스석, 필러 추가
                </Typography>
              </FlexBox>

              <FlexBox flex="160px" m={0.75} alignItems="center">
                <Button variant="text" color="primary">
                  <Typography fontSize="14px">리뷰 작성</Typography>
                </Button>
              </FlexBox>
            </FlexBox>)}
        </Box>
      </Card>

      {/* SHIPPING AND ORDER SUMMERY */}
      <Grid container spacing={3}>
        <Grid item lg={6} md={6} xs={12}>
          <Card sx={{
          p: "20px 30px"
        }}>
            <H5 mt={0} mb={2}>
              주문자 주소
            </H5>

            <Paragraph fontSize={14} my={0}>
              {order.shippingAddress}
            </Paragraph>
          </Card>
        </Grid>

        <Grid item lg={6} md={6} xs={12}>
          <Card sx={{
          p: "20px 30px"
        }}>
            <H5 mt={0} mb={2}>
              결제 금액
            </H5>

            <FlexBetween mb={1}>
              <Typography fontSize={14} color="grey.600">
                상품 가격 합계:
              </Typography>

              <H6 my="0px">{currency(order.totalPrice)}</H6>
            </FlexBetween>

            <FlexBetween mb={1}>
              <Typography fontSize={14} color="grey.600">
                추가 상품 비용:
              </Typography>

              <H6 my="0px">{currency(0)}</H6>
            </FlexBetween>

            <FlexBetween mb={1}>
              <Typography fontSize={14} color="grey.600">
                할인:
              </Typography>

              <H6 my="0px">{currency(order.discount)}</H6>
            </FlexBetween>

            <Divider sx={{
            mb: 1
          }} />

            <FlexBetween mb={2}>
              <H6 my="0px">총 합계</H6>
              <H6 my="0px">{currency(order.totalPrice)}</H6>
            </FlexBetween>

            <Typography fontSize={14}>신용카드 결제</Typography>
          </Card>
        </Grid>
      </Grid>
    </CustomerDashboardLayout>;
};
export const getStaticPaths = async () => {
  const paths = await api.getIds();
  return {
    paths: paths,
    //indicates that no page needs be created at build time
    fallback: "blocking" //indicates the type of fallback
  };
};

export const getStaticProps = async ({
  params
}) => {
  const order = await api.getOrder(String(params.id));
  return {
    props: {
      order
    }
  };
};
export default OrderDetails;