import Link from "next/link";
import { Box, Container, Grid, styled } from "@mui/material";
import Pie from "components/chart/Piechart";
import Line from "components/chart/Linechart";
import LazyImage from "components/LazyImage";
import BazaarCard from "components/BazaarCard";
import HorizonLine from "components/HorizontalLine";
import CategoryIcon from "components/icons/Category";
import RowSpanning from "components/table";
import MyResponsiveTreeMapHtml  from "components/treemap";
import { Typography } from "@mui/material";
import Barchart from "components/chart/Barchart";
import {httpGet, url} from "components/config";
import CategorySectionHeader from "components/CategorySectionHeader";
import { DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector, } from '@mui/x-data-grid';
import { STATUS_OPTIONS, useDemoData, randomDesk, generateFilledQuantity, randomStatusOptions,renderProgress, renderStatus, renderEditProgress, renderEditStatus } from '@mui/x-data-grid-generator';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import React, { useState, useEffect  } from "react";
import {categories1, categories2, categories3, categories4} from "./data";
import { ResponsiveTreeMapHtml } from '@nivo/treemap'
import { ResponsiveLine } from '@nivo/line'
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import dynamic from 'next/dynamic'
import Button from '@mui/material/Button';

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ColorButton = styled(Button)(({ theme }) => ({
  color: "white",
  backgroundColor: "#FE2E64",
  '&:hover': {
    backgroundColor: "#8A0829",
  },
}));

const StyledBazaarCard = styled(BazaarCard)(({
  theme
}) => ({
  display: "flex",
  borderRadius: 8,
  padding: "0.75rem",
  alignItems: "center",
  transition: "all 250ms ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[3],
    backgroundColor: "#F58220",
  },
  "&:activate": {
    boxShadow: theme.shadows[3],
    backgroundColor: "#FF0000",
    borderColor: "#0062cc"
  },
  "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)"
    }
}));

const Section10 = ({
  categories
}) => {
const [hydrated, setHydrated] = useState(false);
useEffect(() => {
    setHydrated(true);
},[])
const [value, setValue] = React.useState(30);
const [valuelist, setValueList] = React.useState([50,50,50,50,50,50,50,50,50,50,50,50,50]);
const [active1, setActive1] = useState("??????????????????????????? ????????????");
const [active2, setActive2] = useState("????????? ????????????");
const [open, setOpen] = useState(false);

const [bardata1, setBarData1] = useState("");
const [bardata2, setBarData2] = useState("");
const [bardata3, setBarData3] = useState("");
const [bardata4, setBarData4] = useState("");

const [piedata1, setPieData1] = useState("");
const [piedata2, setPieData2] = useState("");
const factors = ['??????(??????)','??????(EFA)','??????(EM)','??????','?????????','?????????','???????????????','?????????','?????????','??????/??????','?????????','???????????????','?????????']
function getBarData() {
    console.log(url.concat(`/alloc-port-set/${active2}_${value}_${valuelist.join("|")}`))
    fetch(url.concat(`/alloc-port-set/${active2}_${value}_${valuelist.join("|")}`), { method: 'GET' })
    .then(data => data.json())
    .then(json => {console.log("??????"); setBarData1(json.expected_return); setBarData2(json.risk_return);
    setBarData3(json.exposure_comparison); setBarData4(json.risk_comparison); setPieData1(json.pie_data_bf); setPieData2(json.pie_data_af);
    console.log(json); setOpen(true)})
}
  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleSliderChanges = (e, idx, item) => {

    console.log(idx)
    console.log(item)
    console.log(e.target.value)
    const nextCounters = valuelist.map((c, i) => {
      if (i === idx) {
        return e.target.value;
      } else {
        return c;
      }
    });
    setValueList(nextCounters);
   }

   useEffect(() => {
   "change"
}, [valuelist]);

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

    const handleInputChanges = (event, idx, item) => {
    const nextCounters = valuelist.map((c, i) => {
      if (i === idx) {
        return event.target.value;
      } else {
        return c;
      }
    });
    setValueList(nextCounters);
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };
    const handleBlurs = (e, idx, item) => {
    if (e.target.value < -1) {
    const nextCounters = valuelist.map((c, i) => {
      if (i === idx) {
        return -1;
      } else {
        return c;
      }
    });
    setValueList(nextCounters);
    } else if (e.target.value > 1) {
    const nextCounters = valuelist.map((c, i) => {
      if (i === idx) {
        return 1;
      } else {
        return c;
      }
    });
    setValueList(nextCounters);
    }
  };

function valuetexts(value) {
  return `${(value-50)/100}`;
}


  return <Container sx={{
    mb: "100px"
  }}>
      <CategorySectionHeader seeMoreLink="" title="" />
        <Grid container spacing={3}>
        <Container sx={{ mb: "30px" }} />
        <HorizonLine text="??????????????????????????? ????????????" />
        {categories.map((item, ind) =>
        <Link href={item.slug}>
        <Grid item lg={4} md={6} sm={6} xs={12} key={ind}>
                <a>
                <StyledBazaarCard
                    onClick={() => {setActive1(item.name)}}
                    style={{ backgroundColor: active1==item.name ? "#043B72" : "", color: active1==item.name ? "white" : "black"  }}
                elevation={1}>
                  <LazyImage width={52} height={52} alt="fashion" src={item.image} objectFit="contain" borderRadius="8px" />
                  <Box fontWeight="600" ml={1.25} fontSize={20}>
                    {item.name}
                  </Box>
                </StyledBazaarCard>
              </a>
          </Grid>
          </Link>
          )}
          <Container sx={{ mb: "20px" }} />
          <HorizonLine text="?????? ??????????????? ??????" />
         {categories1.map((item, ind) =>
        <Grid item lg={4} md={6} sm={6} xs={12} key={ind}>
                <a>
                <StyledBazaarCard
                    onClick={() => {setActive2(item.name);}}
                    style={{ backgroundColor: active2==item.name ? "#043B72" : "", color: active2==item.name ? "white" : "black"  }}
                elevation={1}>
                  <Box fontWeight="600" ml={1.25} fontSize={20}>
                    {item.name}
                  </Box>
                </StyledBazaarCard>
              </a>
          </Grid>
          )}
      <Container sx={{ mb: "20px" }} />
      <HorizonLine text="????????? ??????????????? ??????" />
      <Grid item lg={12} md={12} sm={12} xs={12}>
       {/*<StyledBazaarCard style={{ backgroundColor: "#043B72", color:"white" }}>
          <Box fontWeight="600" ml={1.25} fontSize={15}>
              ?????? ?????? ?????? ?????? (????????? vs ?????? ???????????????)
          </Box>
      </StyledBazaarCard>*/}
      <Container sx={{ mb: "20px" }} />
      <Grid container spacing={2} alignItems="center">
      <Typography id="input-slider" gutterBottom>
        {"   ?????? ?????? ??????"}
      </Typography>
        <Grid item lg={4} md={4} sm={6} xs={6} xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <MuiInput
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Grid>
    <Container sx={{ mb: "20px" }} />
    <Stack sx={{ height: 200 }} spacing={4} direction="row">
    {factors.map((item, idx)=>
      <Stack item lg={4} md={12/factors.length} sm={12/factors.length} xs={12/factors.length}>
          <Typography id="input-slider" gutterBottom>
            {item}
          </Typography>
          <Slider
            onChange={e => handleSliderChanges(e,idx, item)}
            aria-label="Temperature"
            orientation="vertical"
            getAriaValueText={valuetexts}
            valueLabelDisplay="auto"
            defaultValue={50}
          />
          <Typography id="input-slider" gutterBottom>
            {valuetexts}
          </Typography>
          <MuiInput
            value={(valuelist[idx]-50)/100}
            size="small"
            onChange={e => handleInputChanges(e, idx, item)}
            onBlur={e => handleBlurs(e, idx, item)}
            inputProps={{
              step: 100,
              min: -1,
              max: 1,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
      </Stack>)}
    </Stack>
     <Container sx={{ mb: "30px" }} />
    <Grid container spacing={1} >
    <Grid item lg={5} md={5} sm={5} xs={5} />
    <Grid item lg={4} md={4} sm={4} xs={4}>
       <ColorButton variant="contained" onClick={() => {getBarData(); }}>????????? ??????????????? ????????????</ColorButton>
    </Grid>
    </Grid>

          <Container sx={{ mb: "30px" }} />
          <HorizonLine text="????????? ??????????????? ??????" />
                     <Grid item xs={6} md={6} lg={6}>
             { open?(<div style={{height: 400}}>
                   <Typography align="center">
                      ?????? ???????????????
                   </Typography>
                <Pie piedata={piedata1} />
             </div>):
           (<div />)
           }
            </Grid>
           <Grid item xs={6} md={6} lg={6}>
             { open?(<div style={{height: 400}}>
                  <Typography align="center">
                      ????????? ???????????????
                   </Typography>
                <Pie piedata={piedata2} />
             </div>):
           (<div />)
           }
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={12}>
          { open?(
                <div style={{height: 400}}>
                      <Typography align="center">
                        ????????? ??????
                      </Typography>
                    <Barchart bardata={bardata1}/>
                </div>
          ):
           (<div />)
           }
           </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
          { open?(
                <div style={{height: 400}}>
                      <Typography align="center">
                        ?????????-??????
                      </Typography>
                    <Barchart bardata={bardata2}/>
                </div>
          ):
           (<div />)
           }
           </Grid>
           <Container sx={{ mb: "20px" }} />
           <Grid item lg={12} md={12} sm={12} xs={12}>
          { open?(
                <div style={{height: 300}}>
                      <Typography align="center">
                        ?????? ?????????
                      </Typography>
                    <Barchart bardata={bardata3}/>
                </div>
          ):
           (<div />)
           }
           </Grid>
           <Grid item lg={12} md={12} sm={12} xs={12}>
          { open?(
                <div style={{height: 300}}>
                      <Typography align="center">
                        ?????? ?????????
                      </Typography>
                    <Barchart bardata={bardata4}/>
                </div>
          ):
           (<div />)
           }
           </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
          { open?(
                <div style={{height: 300}}>
                      <Typography align="center">
                        ?????? ?????????
                      </Typography>
                    <Line linedata={""}/>
                </div>
          ):
           (<div />)
           }
           </Grid>



        <Container sx={{ mb: "20px" }} />
        </Grid>
        </Container>;
};
export default Section10;