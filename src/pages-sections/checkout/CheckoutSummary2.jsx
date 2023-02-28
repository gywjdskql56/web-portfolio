import { Box, Divider } from "@mui/material";
import { FlexBetween } from "components/flex-box";
import { Paragraph, Span } from "components/Typography";
import { currency } from "lib";
const CheckoutSummary2 = () => {
  return <Box>
      <Paragraph color="secondary.900" fontWeight={700} mb={2}>
        주문 상세
      </Paragraph>

      {cartList.map(item => <FlexBetween mb={1.5} key={item.name}>
          <Paragraph>
            <Span fontWeight="700" fontSize="14px">
              {item.quantity}
            </Span>{" "}
            x {item.name}
          </Paragraph>
          <Paragraph>{currency(item.price)}</Paragraph>
        </FlexBetween>)}

      <Divider sx={{
      borderColor: "grey.300",
      my: 3
    }} />

      <FlexBetween mb={0.5}>
        <Paragraph color="grey.600">소계:</Paragraph>
        <Paragraph fontWeight="700">{currency(2610)}</Paragraph>
      </FlexBetween>

      <FlexBetween mb={0.5}>
        <Paragraph color="grey.600">추가옵션비용:</Paragraph>
        <Paragraph fontWeight="700">-</Paragraph>
      </FlexBetween>

      <FlexBetween mb={0.5}>
        <Paragraph color="grey.600">세금:</Paragraph>
        <Paragraph fontWeight="700">{currency(40)}</Paragraph>
      </FlexBetween>

      <FlexBetween mb={3}>
        <Paragraph color="grey.600">할인:</Paragraph>
        <Paragraph fontWeight="700">-</Paragraph>
      </FlexBetween>

      <Divider sx={{
      borderColor: "grey.300",
      mb: 1
    }} />

      <FlexBetween fontWeight="700" mb={1}>
        <Paragraph>총합계:</Paragraph>
        <Paragraph fontWeight="700">{currency(2650)}</Paragraph>
      </FlexBetween>
    </Box>;
};
const cartList = [{
  name: "인천 라식/라섹 여행패키지",
  quantity: 1,
  price: 999
}, {
  name: "인천 필러",
  quantity: 1,
  price: 1199
}, {
  name: "인천 피부과 2일 패키지",
  quantity: 1,
  price: 1299
}];
export default CheckoutSummary2;