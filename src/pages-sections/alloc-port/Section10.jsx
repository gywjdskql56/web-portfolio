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

const ExplainCard = styled(BazaarCard)(({
  theme
}) => ({
  display: "flex",
  borderRadius: 8,
  padding: "0.75rem",
  alignItems: "center",
  transition: "all 250ms ease-in-out",
}));

const Section10 = ({
  categories
}) => {
const [hydrated, setHydrated] = useState(false);
useEffect(() => {
    setHydrated(true);
},[])
const [value, setValue] = React.useState(30);
const [valuelist, setValueList] = React.useState([0,0,0,0,0,0,0,0,0,0,0,0,0]);
const [active1, setActive1] = useState("자산배분포트폴리오 직접생성");
const [active2, setActive2] = useState("변동성 알고리즘");
const [open, setOpen] = useState(false);

const [bardata1, setBarData1] = useState("");
const [bardata2, setBarData2] = useState("");
const [bardata3, setBarData3] = useState("");
const [bardata4, setBarData4] = useState("");

const [piedata1, setPieData1] = useState("");
const [piedata2, setPieData2] = useState("");

const [linedata, setLineData] = useState("");

const factors = ['주식(미국)','주식(EFA)','주식(EM)','금리','크레딧','원자재','인플레이션','원달러','중소형','가치/성장','수익성','회계퀄리티','모멘텀']
function getBarData() {
    console.log(url.concat(`/alloc-port-set/${active2}_${value}_${valuelist.join("|")}`))
    fetch(url.concat(`/alloc-port-set/${active2}_${value}_${valuelist.join("|")}`), { method: 'GET' })
    .then(data => data.json())
    .then(json => {console.log("완료"); setBarData1(json.expected_return); setBarData2(json.risk_return);
    setBarData3(json.exposure_comparison); setBarData4(json.risk_comparison); setPieData1(json.pie_data_bf); setPieData2(json.pie_data_af); setLineData(json.backtest_returns);
    console.log(json); setOpen(true)})
}
function getSliderData() {
    console.log(url.concat(`/alloc-port-set-pre/${active2}`))
    fetch(url.concat(`/alloc-port-set-pre/${active2}`), { method: 'GET' })
    .then(data => data.json())
    .then(json => {console.log("완료"); setValueList(json.valuelist);})
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
  return `${value}`;
}


  return <Container sx={{
    mb: "100px"
  }}>
      <CategorySectionHeader seeMoreLink="" title="" />
        <Grid container spacing={3}>
        <Container sx={{ mb: "30px" }} />
        <HorizonLine text="자산배분포트폴리오 직접생성" />
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
          <Grid item lg={12} md={12} sm={12} xs={12}>
          <ExplainCard>
            <Box fontWeight="100" ml={1.25} fontSize={15}>
              {"미래에셋 자산운용에서 추천하는 포트폴리오를 기반으로 자산배분 포트폴리오를 직접 구성해볼 수 있습니다."}
            </Box>
          </ExplainCard>
          </Grid>
          <Container sx={{ mb: "20px" }} />
          <HorizonLine text="기초 포트폴리오 선택" />
         {categories1.map((item, ind) =>
        <Grid item lg={4} md={6} sm={6} xs={12} key={ind}>
                <a>
                <StyledBazaarCard
                    onClick={() => {setActive2(item.name); getSliderData();}}
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
      <HorizonLine text="맞춤형 포트폴리오 구성" />
      <Grid item lg={12} md={12} sm={12} xs={12}>
       {/*<StyledBazaarCard style={{ backgroundColor: "#043B72", color:"white" }}>
          <Box fontWeight="600" ml={1.25} fontSize={15}>
              최대 추적 오차 결정 (맞춤형 vs 기초 포트폴리오)
          </Box>
      </StyledBazaarCard>*/}
      <Container sx={{ mb: "20px" }} />
      <Grid container spacing={2} alignItems="center">
      <Typography id="input-slider" gutterBottom>
        {"   최대 추적 오차"}
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
            min = {-1}
            max = {1}
            step = {0.1}
            onChange={e => handleSliderChanges(e,idx, item)}
            aria-label="Temperature"
            orientation="vertical"
            getAriaValueText={valuetexts}
            valueLabelDisplay="auto"
            defaultValue={0}
          />
          <Typography id="input-slider" gutterBottom>
            {valuetexts}
          </Typography>
          <MuiInput
            value={valuelist[idx]}
            size="small"
            onChange={e => handleInputChanges(e, idx, item)}
            onBlur={e => handleBlurs(e, idx, item)}
            inputProps={{
              step: 0.1,
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
       <ColorButton variant="contained" onClick={() => {getBarData(); }}>맞춤형 포트폴리오 생성하기</ColorButton>
    </Grid>
    </Grid>

          <Container sx={{ mb: "30px" }} />
          <HorizonLine text="맞춤형 포트폴리오 분석" />
                     <Grid item xs={6} md={6} lg={6}>
             { open?(<div style={{height: 400}}>
                   <Typography align="center">
                      기초 포트폴리오
                   </Typography>
                <Pie piedata={piedata1} />
             </div>):
           (<div />)
           }
            </Grid>
           <Grid item xs={6} md={6} lg={6}>
             { open?(<div style={{height: 400}}>
                  <Typography align="center">
                      맞춤형 포트폴리오
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
                        국면별 성과
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
                        리스크-리턴
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
                        팩터 노출도
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
                        위험 기여도
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
                        수익률
                      </Typography>
                    <Line linedata={linedata}/>
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