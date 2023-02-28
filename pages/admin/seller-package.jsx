import { Add } from "@mui/icons-material";
import { Box, Button, Grid } from "@mui/material";
import { FlexBetween } from "components/flex-box";
import GoldPackageIcon from "components/icons/GoldPackageIcon";
import PremiumPackageIcon from "components/icons/PremiumPackageIcon";
import SilverPackageIcon from "components/icons/SilverPackageIcon";
import AdminDashboardLayout from "components/layouts/admin-dashboard";
import { H3 } from "components/Typography";
import { SellerPackageCard } from "pages-sections/admin";
const packageList = [{
  id: 1,
  price: 25,
  packageName: "Premium",
  Icon: PremiumPackageIcon,
  features: ["상품 업로드 제한: 250개", "수수료율: 5%", "패키지 기한: 1,095일"]
}, {
  id: 2,
  price: 15,
  packageName: "Gold",
  Icon: GoldPackageIcon,
  features: ["상품 업로드 제한: 250개", "수수료율: 5%", "패키지 기한: 1,095일"]
}, {
  id: 3,
  price: 10,
  packageName: "Silver",
  Icon: SilverPackageIcon,
  features: ["상품 업로드 제한: 250개", "수수료율: 5%", "패키지 기한: 1,095일"]
}];

// =============================================================================
SellerPackage.getLayout = function getLayout(page) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
// =============================================================================

export default function SellerPackage() {
  return <Box py={4}>
      <FlexBetween mb={2}>
        <H3>판매자 패키지 상품</H3>

        <Button color="info" variant="contained" startIcon={<Add />}>
          새로운 패키지 상품
        </Button>
      </FlexBetween>

      <Grid container spacing={3}>
        {packageList.map(item => <Grid item xl={4} md={6} xs={12} key={item.id}>
            <SellerPackageCard listItem={item} />
          </Grid>)}
      </Grid>
    </Box>;
}