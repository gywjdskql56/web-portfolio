import { Delete, KeyboardArrowDown } from "@mui/icons-material";
import { Box, Card, Grid, Button, Avatar, Divider, MenuItem, TextField, IconButton } from "@mui/material";
import { format } from "date-fns";
import { FlexBetween, FlexBox } from "components/flex-box";
import { H5, H6, Paragraph, Span } from "components/Typography";
import { currency } from "lib";
// ===================================================================

const OrderDetails = ({
  order
}) => {
  return <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{
        p: 3
      }}>
          <FlexBox alignItems="center" gap={4}>
            <Paragraph>
              <Span color="grey.600">주문번호:</Span> {order.id}
            </Paragraph>

            <Paragraph>
              <Span color="grey.600">주문일시:</Span>{" "}
              {format(new Date(order.createdAt), "yyyy-MM-dd")}
            </Paragraph>
          </FlexBox>

          <FlexBox gap={3} my={3} flexDirection={{
          sm: "row",
          xs: "column"
        }}>
            <TextField fullWidth color="info" size="medium" variant="outlined" label="상품명" placeholder="상품명을 입력하세요." />

            <TextField select fullWidth color="info" size="medium" defaultValue={order.status} label="주문 처리 상태" inputProps={{
            IconComponent: () => <KeyboardArrowDown sx={{
              color: "grey.600",
              mr: 1
            }} />
          }}>
              <MenuItem value="Processing">주문확인중</MenuItem>
              <MenuItem value="Pending">처리진행중</MenuItem>
              <MenuItem value="Delivered">예약확정</MenuItem>
              <MenuItem value="Cancelled">주문취소</MenuItem>
            </TextField>
          </FlexBox>

          {order.items.map((item, index) => <Box my={2} gap={2} key={index} sx={{
          display: "grid",
          gridTemplateColumns: {
            md: "1fr 1fr",
            xs: "1fr"
          }
        }}>
              <FlexBox flexShrink={0} gap={1.5} alignItems="center">
                <Avatar src={item.product_img} sx={{
              height: 64,
              width: 64,
              borderRadius: "8px"
            }} />

                <Box>
                  <H6 mb={1}>{item.product_name}</H6>

                  <FlexBox alignItems="center" gap={1}>
                    <Paragraph fontSize={14} color="grey.600">
                      {currency(item.product_price)} x
                    </Paragraph>

                    <Box maxWidth={60}>
                      <TextField defaultValue={item.product_quantity} type="number" fullWidth />
                    </Box>
                  </FlexBox>
                </Box>
              </FlexBox>

              <FlexBetween flexShrink={0}>
                <Paragraph color="grey.600">
                  추가 옵션: 비즈니스석으로 변경, 필러 추가
                </Paragraph>

                <IconButton>
                  <Delete sx={{
                color: "grey.600",
                fontSize: 22
              }} />
                </IconButton>
              </FlexBetween>
            </Box>)}
        </Card>
      </Grid>

      <Grid item md={6} xs={12}>
        <Card sx={{
        px: 3,
        py: 4
      }}>
          <TextField rows={5} multiline fullWidth color="info" variant="outlined" label="수수료율" defaultValue={order.shippingAddress} sx={{
          mb: 4
        }} />

          <TextField rows={5} multiline fullWidth color="info" variant="outlined" label="고객 요청사항" defaultValue="I want to make an appointment ASAP." />
        </Card>
      </Grid>

      <Grid item md={6} xs={12}>
        <Card sx={{
        px: 3,
        py: 4
      }}>
          <H5 mt={0} mb={2}>
            상품 가격
          </H5>

          <FlexBetween mb={1.5}>
            <Paragraph color="grey.600">소계:</Paragraph>
            <H6>{currency(order.totalPrice)}</H6>
          </FlexBetween>

          <FlexBetween mb={1.5}>
            <Paragraph color="grey.600">세금:</Paragraph>

            <FlexBox alignItems="center" gap={1} maxWidth={100}>
              <Paragraph>$</Paragraph>
              <TextField color="info" defaultValue={10} type="number" fullWidth />
            </FlexBox>
          </FlexBetween>

          <FlexBetween mb={1.5}>
            <Paragraph color="grey.600">할인(%):</Paragraph>

            <FlexBox alignItems="center" gap={1} maxWidth={100}>
              <Paragraph>$</Paragraph>
              <TextField color="info" defaultValue={order.discount} type="number" fullWidth />
            </FlexBox>
          </FlexBetween>

          <Divider sx={{
          my: 2
        }} />

          <FlexBetween mb={2}>
            <H6>총합계</H6>
            <H6>{currency(order.totalPrice)}</H6>
          </FlexBetween>

          <Paragraph>신용카드로 결제</Paragraph>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" color="info">
          저장
        </Button>
      </Grid>
    </Grid>;
};
export default OrderDetails;