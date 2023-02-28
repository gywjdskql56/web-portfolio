import Link from "next/link";
import { Box, Container, Grid, IconButton, styled } from "@mui/material";
import AppStore from "components/AppStore";
import Image from "components/BazaarImage";
import { FlexBox } from "components/flex-box";
import { Paragraph } from "components/Typography";
import Google from "components/icons/Google";
import Twitter from "components/icons/Twitter";
import Youtube from "components/icons/Youtube";
import Facebook from "components/icons/Facebook";
import Instagram from "components/icons/Instagram";

// styled component
const StyledLink = styled("a")(({
  theme
}) => ({
  display: "block",
  borderRadius: 4,
  cursor: "pointer",
  position: "relative",
  padding: "0.3rem 0rem",
  color: theme.palette.grey[500],
  "&:hover": {
    color: theme.palette.grey[100]
  }
}));
const Footer1 = () => {
  return <footer>
      <Box bgcolor="#222935">
        <Container sx={{
        p: "1rem",
        color: "white"
      }}>
          <Box py={10} overflow="hidden">
            <Grid container spacing={3}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Paragraph mb={0.5} color="grey.500">
                  미래에셋 자산운용 AI금융공학시스템의 포트폴리오 자문 시스템
                </Paragraph>

                <Paragraph mb={0.5} color="grey.500">
                  ⓒ 2020 Mirae Asset Global Investments Co.,Ltd.
                </Paragraph>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </footer>;
};
const aboutLinks = ["인사말","언론보도","자료공개"];
const customerCareLinks = ["자주 묻는 말","고객센터"];
const iconList = [{
  icon: Facebook,
  url: "https://www.facebook.com/UILibOfficial"
}, {
  icon: Twitter,
  url: "https://twitter.com/uilibofficial"
}, {
  icon: Youtube,
  url: "https://www.youtube.com/channel/UCsIyD-TSO1wQFz-n2Y4i3Rg"
}, {
  icon: Google,
  url: "https://www.google.com/search?q=ui-lib.com"
}, {
  icon: Instagram,
  url: "https://www.instagram.com/uilibofficial/"
}];
export default Footer1;