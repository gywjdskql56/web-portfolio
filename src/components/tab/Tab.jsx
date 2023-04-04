import Link from "next/link";
import { Fragment, useState } from "react";
import { Badge, Box, Button, Dialog, Drawer, styled } from "@mui/material";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Clear, KeyboardArrowDown, PersonOutline } from "@mui/icons-material";
import clsx from "clsx";
import Icon from "components/icons";
import { layoutConstant } from "utils/constants";
import Login from "pages-sections/sessions/Login";
import { useAppContext } from "contexts/AppContext";
import Image from "components/BazaarImage";
import MiniCart from "components/MiniCart";
import Category from "components/icons/Category";
import { Paragraph } from "components/Typography";
import MobileMenu from "components/navbar/MobileMenu";
import { FlexBetween, FlexBox } from "components/flex-box";
import CategoryMenu from "components/categories/CategoryMenu";
import ShoppingBagOutlined from "components/icons/ShoppingBagOutlined";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@material-ui/core/Typography';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
// styled component
export const HeaderWrapper = styled(Box)(({
  theme
}) => ({
  zIndex: 3,
  position: "relative",
  height: layoutConstant.headerHeight,
  transition: "height 250ms ease-in-out",
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: {
    height: layoutConstant.mobileHeaderHeight
  }
}));
const StyledContainer = styled(Container)({
  gap: 2,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
});

// ==============================================================

// ==============================================================

const MenuTab = ({
  isFixed,
  className,
  searchInput
}) => {
  const theme = useTheme();
  const {
    state
  } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const downMd = useMediaQuery(theme.breakpoints.down(1150));
  const toggleDialog = () => setDialogOpen(!dialogOpen);
  const toggleSidenav = () => setSidenavOpen(!sidenavOpen);
  const toggleSearchBar = () => setSearchBarOpen(!searchBarOpen);
  // FOR TABS
  const [value, setValue] = useState('one');
  const handleChange = (event, newValue) => {
    console.log(event)
    console.log(newValue)
    setValue(newValue);
  };


  // FOR SMALLER DEVICE
  if (downMd) {
    const ICON_STYLE = {
      color: "grey.600",
      fontSize: 15
    };
    return <HeaderWrapper className={clsx(className)}>
      <StyledContainer>
        <Box sx={{ width: '100%' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="info"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
          >
              <Link href={`/home`}>
                <Tab value="one" label={(<Typography variant="h6" style={{color: 'blue'}} color="#043B72">나만의 포트폴리오 구성</Typography>)} />
              </Link>
              <Link href={`/home`}>
              <Tab value="two" label={(<Typography variant="h6" style={{color:"#043B72"}}>INFORMATION</Typography>)} />
              </Link>
          </Tabs>
        </Box>
      </StyledContainer>
      </HeaderWrapper>;
  }
  return <HeaderWrapper className={clsx(className)}>
        <StyledContainer>
          <Box sx={{ width: '100%' }} sx={{ height: '120%' }}>
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
            >
              <Tab value="one" label={(<Typography variant="h6">나만의 포트폴리오 구성</Typography>)} />
              <Tab value="two" label={(<Typography variant="h6">INFORMATION</Typography>)} />
            </TabList>
               <TabPanel value="one">
                  <Link href={`/suggest-port`}>
                    <Tab label={(<Typography variant="h8">추천 포트폴리오</Typography>)} />
                  </Link>
                  <Link href={`/stock-port`}>
                    <Tab label={(<Typography variant="h8">포트폴리오 직접 생성</Typography>)} />
                  </Link>
                  <Link href={`/alloc-port`}>
                    <Tab label={(<Typography variant="h8">자산배분포트폴리오 직접생성</Typography>)} />
                  </Link>
               </TabPanel>
               <TabPanel value="two">
{/*                  <Link href={`/home`}>
                    <Tab label={(<Typography variant="h8">주요시장상황</Typography>)} />
                  </Link>
                  <Link href={`/home`}>
                    <Tab label={(<Typography variant="h8">AI국면모델</Typography>)} />
                  </Link>*/}
                  <Link href={`/company-perform`}>
                    <Tab label={(<Typography variant="h8">기업실적발표</Typography>)} />
                  </Link>
                  {/*<Link href={`/company`}>
                    <Tab label={(<Typography variant="h8">기업컨센추이</Typography>)} />
                  </Link>*/}
                  <Link href={`/recent-etf`}>
                    <Tab label={(<Typography variant="h8">최근출시ETF</Typography>)} />
                  </Link>
                  <Link href={`/hedge_follow`}>
                    <Tab label={(<Typography variant="h8">Popular 해외 포트폴리오</Typography>)} />
                  </Link>

               </TabPanel>
              </TabContext>
          </Box>
        </StyledContainer>
    </HeaderWrapper>;
};
export default MenuTab;