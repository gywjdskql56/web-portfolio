import { Button, Card } from "@mui/material";
import { FlexBetween } from "components/flex-box";
import { H5 } from "components/Typography";
import React from "react";
import DataListTable from "./table";

// table column list
const tableHeading = [{
  id: "product",
  label: "상품",
  alignRight: false
}, {
  id: "stock",
  label: "재고",
  alignRight: false
}, {
  id: "amount",
  label: "금액",
  alignCenter: true
}];

// ======================================================

// ======================================================

const StockOutProducts = ({
  data
}) => {
  return <Card sx={{
    height: "100%"
  }}>
      <FlexBetween px={3} py={2.5}>
        <H5>품절된 상품</H5>

        <Button size="small" color="info" variant="outlined">
          전체보기
        </Button>
      </FlexBetween>

      <DataListTable dataList={data} tableHeading={tableHeading} type="STOCK_OUT" />
    </Card>;
};
export default StockOutProducts;