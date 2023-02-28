import Link from "next/link";
import { Avatar, Box, Card, Grid } from "@mui/material";
import { H3, H4 } from "components/Typography";
import { FlexRowCenter } from "components/flex-box";

// ====================================================

// ====================================================

const AvailableShops = () => {
  return <Box mb={7.5}>
      <H3 mb={3}>같은 지역에서 즐길거리</H3>

      <Grid container spacing={4}>
        {shopList.map(item => <Grid item lg={2} md={3} sm={4} xs={12} key={item.name}>
            <Link href="/shops/scarlett-beauty">
              <a>
                <FlexRowCenter p={3.25} width="100%" component={Card} flexDirection="column">
                  <Avatar src={item.imgUrl} sx={{
                width: 48,
                height: 48
              }} />
                  <H4 mt={1.5} color="grey.800">
                    {item.name}
                  </H4>
                </FlexRowCenter>
              </a>
            </Link>
          </Grid>)}
      </Grid>
    </Box>;
};
const shopList = [{
  name: "자전거 투어",
  imgUrl: "/assets/images/faces/propic.png"
}, {
  name: "송도 아울렛",
  imgUrl: "/assets/images/faces/propic(1).png"
}, {
  name: "카페거리",
  imgUrl: "/assets/images/faces/propic(8).png"
}];
export default AvailableShops;