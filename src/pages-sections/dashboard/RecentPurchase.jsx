import { Button, Card } from "@mui/material";
import { H5 } from "components/Typography";
import { FlexBetween } from "components/flex-box";
import DataListTable from "./table";

// table column list
const tableHeading = [{
  id: "orderId",
  label: "주문번호",
  alignRight: false
}, {
  id: "product",
  label: "상품",
  alignRight: false
}, {
  id: "payment",
  label: "상태",
  alignRight: false
}, {
  id: "amount",
  label: "금액",
  alignCenter: true
}];

// ===================================================

// ===================================================

const RecentPurchase = ({
  data
}) => {
  return <Card>
      <FlexBetween px={3} py={2.5}>
        <H5>최근 주문 상품</H5>

        <Button size="small" color="info" variant="outlined">
          전체보기
        </Button>
      </FlexBetween>

      <DataListTable dataList={data} tableHeading={tableHeading} type="RECENT_PURCHASE" />
    </Card>;
};
export default RecentPurchase;