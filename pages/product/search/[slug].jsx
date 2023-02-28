import { useCallback, useState } from "react";
import { Apps, FilterList, ViewList } from "@mui/icons-material";
import { Box, Card, Container, Grid, IconButton, MenuItem, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Sidenav from "components/Sidenav";
import { FlexBox } from "components/flex-box";
import { H5, Paragraph } from "components/Typography";
import ShopLayout1 from "components/layouts/ShopLayout1";
import ProductCard1List from "components/products/ProductCard1List";
import ProductCard9List from "components/products/ProductCard9List";
import ProductFilterCard from "components/products/ProductFilterCard";
import productDatabase from "data/product-database";
const ProductSearchResult = () => {
  const [view, setView] = useState("grid");
  const downMd = useMediaQuery(theme => theme.breakpoints.down("md"));
  const toggleView = useCallback(v => () => setView(v), []);
  return <ShopLayout1>
      <Container sx={{
      mt: 4,
      mb: 6
    }}>
        {/* TOP BAR AREA */}
        <Card elevation={1} sx={{
        mb: "55px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        p: {
          sm: "1rem 1.25rem",
          md: "0.5rem 1.25rem",
          xs: "1.25rem 1.25rem 0.25rem"
        }
      }}>
          <Box>
            <H5>“ 성형 ”에 대한 검색결과입니다.</H5>
            <Paragraph color="grey.600">48 개의 상품</Paragraph>
          </Box>

          <FlexBox alignItems="center" columnGap={4} flexWrap="wrap" my="0.5rem">
            <FlexBox alignItems="center" gap={1} flex="1 1 0">
              <Paragraph color="grey.600" whiteSpace="pre">
                정렬기준:
              </Paragraph>

              <TextField select fullWidth size="small" variant="outlined" placeholder="Short by" defaultValue={sortOptions[0].value} sx={{
              flex: "1 1 0",
              minWidth: "150px"
            }}>
                {sortOptions.map(item => <MenuItem value={item.value} key={item.value}>
                    {item.label}
                  </MenuItem>)}
              </TextField>
            </FlexBox>

            <FlexBox alignItems="center" my="0.25rem">
              <Paragraph color="grey.600" mr={1}>
                보기형식:
              </Paragraph>

              <IconButton onClick={toggleView("grid")}>
                <Apps color={view === "grid" ? "primary" : "inherit"} fontSize="small" />
              </IconButton>

              <IconButton onClick={toggleView("list")}>
                <ViewList color={view === "list" ? "primary" : "inherit"} fontSize="small" />
              </IconButton>

              {/* SHOW IN THE SMALL DEVICE */}
              {downMd && <Sidenav handle={<IconButton>
                      <FilterList fontSize="small" />
                    </IconButton>}>
                  <ProductFilterCard />
                </Sidenav>}
            </FlexBox>
          </FlexBox>
        </Card>

        <Grid container spacing={3}>
          {/* PRODUCT FILTER SIDEBAR AREA */}
          <Grid item md={3} sx={{
          display: {
            md: "block",
            xs: "none"
          }
        }}>
            <ProductFilterCard />
          </Grid>

          {/* PRODUCT VIEW AREA */}
          <Grid item md={9} xs={12}>
            {view === "grid" ? <ProductCard1List products={productDatabase.slice(0, 10)} /> : <ProductCard9List products={productDatabase.slice(0, 10)} />}
          </Grid>
        </Grid>
      </Container>
    </ShopLayout1>;
};
const sortOptions = [{
  label: "연관성",
  value: "Relevance"
}, {
  label: "최신순",
  value: "Date"
}, {
  label: "가격 낮은순",
  value: "Price Low to High"
}, {
  label: "가격 높은순",
  value: "Price High to Low"
}];
export default ProductSearchResult;