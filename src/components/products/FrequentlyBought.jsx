import { Fragment } from "react";
import { Box, Button, styled } from "@mui/material";
import { H2, H3, Span } from "components/Typography";
import { FlexBox, FlexRowCenter } from "components/flex-box";
import ProductCard8 from "components/product-cards/ProductCard8";
import { currency } from "lib";

// styled component
const WrapperBox = styled(Box)(({
  theme
}) => ({
  [theme.breakpoints.down("sm")]: {
    "& .card-holder": {
      flexDirection: "column"
    }
  }
}));

// ============================================================

// ============================================================

const FrequentlyBought = ({
  productsData
}) => {
  return <WrapperBox mb={7.5}>
      <H3 mb={3}>함께 많이 구매하시는 상품</H3>

      <FlexBox className="card-holder" flexWrap="wrap" m={-1}>
        {productsData.map((item, ind) => <Fragment key={item.id}>
            <ProductCard8 id={item.id} key={item.id} slug={item.slug} price={item.price} title={item.title} imgUrl={item.thumbnail} sx={{
          width: "100%",
          flex: "1 1 0",
          minWidth: "160px",
          margin: {
            xs: 0,
            sm: 1
          },
          maxWidth: {
            xs: "100%",
            sm: "220px"
          }
        }} />

            {ind < productsData.length - 1 && <FlexRowCenter>
                <H2 color="grey.600" mx={1}>
                  +
                </H2>
              </FlexRowCenter>}
          </Fragment>)}

        <FlexRowCenter>
          <H2 color="grey.600" mx={3}>
            =
          </H2>
        </FlexRowCenter>

        <FlexRowCenter m={1} minWidth={300} minHeight={200} border="1px solid" borderRadius="8px" className="gray-box" borderColor="grey.400" flexDirection="column">
          <H3 color="primary.main">{currency(2500)}</H3>
          <Span mb={2} fontWeight="600" color="grey.600">
            {currency(500)}가 할인됩니다.
          </Span>

          <FlexBox gap={1.5}>
            <Button variant="contained" color="primary">
              장바구니에 추가하기
            </Button>

            <Button variant="outlined" color="primary">
              위시리스트에 추가하기
            </Button>
          </FlexBox>
        </FlexRowCenter>
      </FlexBox>
    </WrapperBox>;
};
export default FrequentlyBought;