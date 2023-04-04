import Link from "next/link";
import { Box, Container, Grid, styled } from "@mui/material";
import LazyImage from "components/LazyImage";
import BazaarCard from "components/BazaarCard";
import CardMedia from "@mui/material/CardMedia";
import { Modal, Button, debounce, Checkbox, TextField, IconButton, FormControlLabel, ClickAwayListener } from "@mui/material";
import HorizonLine from "components/HorizontalLine";
import CategoryIcon from "components/icons/Category";
import RowSpanning from "components/table";
import MyResponsiveTreeMapHtml  from "components/treemap";
import Pie from "components/chart/Piechart";
import {httpGet, url, url2} from "components/config";
import CategorySectionHeader from "components/CategorySectionHeader";
import { DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector, } from '@mui/x-data-grid';
import { STATUS_OPTIONS, useDemoData, randomDesk, generateFilledQuantity, randomStatusOptions,renderProgress, renderStatus, renderEditProgress, renderEditStatus } from '@mui/x-data-grid-generator';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import React, { useState, useEffect  } from "react";
import {categories1, categories2, categories3, categories4} from "./data";
import { ResponsiveTreeMapHtml } from '@nivo/treemap'
import { ResponsiveLine } from '@nivo/line'
import dynamic from 'next/dynamic'
import Typography from '@material-ui/core/Typography';
import Line from "components/chart/Linechart";
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import ReactTable from "components/react-table/Port-Table";
import PeriodTable from "components/react-table/Period-Table";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

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
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ExplainCard = styled(BazaarCard)(({
  theme
}) => ({
  display: "flex",
  borderRadius: 8,
  padding: "0.75rem",
  alignItems: "center",
  transition: "all 250ms ease-in-out",
  fontWeight: 100,
  backgroundColor: "#DCDCDC",
    "&:hover": {
    boxShadow: theme.shadows[3],
    backgroundColor: "#C0C0C0",
  },
}));

const ExplainCard_wh = styled(BazaarCard)(({
  theme
}) => ({
  display: "flex",
  borderRadius: 8,
  padding: "0.75rem",
  alignItems: "center",
  transition: "all 250ms ease-in-out",
  fontWeight: 100,
  backgroundColor: "#FFFFFF",
}));

function valuetexts(value) {
  return `${value}`;
}

const Section10 = ({
  categories
}) => {

const [active1, setActive1] = useState("주식포트폴리오 직접생성");
const [active2, setActive2] = useState("글로벌 주식");
const [active3, setActive3] = useState("테마");
const [active4, setActive4] = useState("그린");
const [active5, setActive5] = useState("배터리");
const [open, setOpen] = useState(false);
const [openF, setOpenF] = useState(false);
const [openE, setOpenE] = useState(false);
const [value, setValue] = useState(10);
const [portdata, setPortData] = useState("");
const [rmticker, setRMticker] = useState(["제외종목"]);
const [valuelist, setValueList] = React.useState([0,0,0,0,0,0,0,0]);

function getAreaData() {
    console.log(url.concat(`/di_univ/${active3}_${active4}_${active5}_${rmticker.join('|')}_${value}_${valuelist.join('|')}`))
    fetch(url.concat(`/di_univ/${active3}_${active4}_${active5}_${rmticker.join('|')}_${value}_${valuelist.join('|')}`), { method: 'GET' })
    .then(data => data.json())
    .then(json => {setPortData(json); console.log(json); })
    .then(json => {setOpen(true);})

}
  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }

  };

    const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));

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
const factors = ['GROWTH','LIQUIDITY','PRICE_MOM','QUALITY','SENTIMENT','SIZE','VALUE','VOLATILITY']
useEffect(() => {
    console.log(categories3[active3][0].name)
    setActive4(categories3[active3][0].name)
}, [active3]);

useEffect(() => {
    console.log(categories4[active4][0].name)
    setActive5(categories4[active4][0].name)

}, [active4]);


useEffect(() => {
    console.log(active4)
    console.log(active5)
    getAreaData()
}, [active5]);

useEffect(() => {
    console.log(value)
    getAreaData()
}, [value]);

useEffect(() => {
    console.log(value)
    getAreaData()
}, [valuelist]);


useEffect(() => {
    console.log(rmticker)
{/*}    console.log(url.concat(`/di_univ/${active3}_${active4}_${active5}_${rmticker.join('|')}`))*/}
    fetch(url.concat(`/di_univ/${active3}_${active4}_${active5}_${rmticker.join('|')}_${value}_${valuelist.join('|')}`), { method: 'GET' })
    .then(data => data.json())
    .then(json => {setPortData(json); console.log(json)})
}, [rmticker]);

const handleOpenF = () => setOpenF(true);
const handleCloseF = () => setOpenF(false);
const handleOpenE = () => setOpenE(true);
const handleCloseE = () => setOpenE(false);

const state = {
            series: [
    {
      name: "series-1",
      data: [30, 40, 25, 50, 49, 21, 70, 51]
    },
  ],
            options: {
              chart: {
                type: 'area',
                stacked: false,
                height: 350,
                zoom: {
                  type: 'x',
                  enabled: true,
                  autoScaleYaxis: true
                },
                toolbar: {
                  autoSelected: 'zoom'
                }
              },
              dataLabels: {
                enabled: false
              },
              markers: {
                size: 0,
              },
              title: {
                text: 'Stock Price Movement',
                align: 'left'
              },
              fill: {
                type: 'gradient',
                gradient: {
                  shadeIntensity: 1,
                  inverseColors: false,
                  opacityFrom: 0.5,
                  opacityTo: 0,
                  stops: [0, 90, 100]
                },
              },
              yaxis: {
                labels: {
                  formatter: function (val) {
                    return (val / 1000000).toFixed(0);
                  },
                },
                title: {
                  text: 'Price'
                },
              },
              xaxis: {
                type: 'datetime',
              },
              tooltip: {
                shared: false,
                y: {
                  formatter: function (val) {
                    return (val / 1000000).toFixed(0)
                  }
                }
              }
            },
          };



  return <Container sx={{
    mb: "100px"
  }}>
      <CategorySectionHeader seeMoreLink="" title="" />
        <Grid container spacing={3}>
        <Container sx={{ mb: "30px" }} />
        <HorizonLine text="주식포트폴리오 직접생성" />
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
              <ExplainCard_wh>
                <Box fontWeight="100" ml={1.25} fontSize={15}>
                  {"주식으로 구성된 포트폴리오를 다이렉트 인덱싱을 활용해서 직접 만들어볼 수 있습니다."}
                </Box>
              </ExplainCard_wh>
          </Grid>
          <Container sx={{ mb: "20px" }} />
          <HorizonLine text="기본 지수 선택" />
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
          <HorizonLine text="투자 컨셉 선택" />
         {categories2.map((item, ind) =>
        <Grid item lg={4} md={6} sm={6} xs={12} key={ind}>
                <a>
                <StyledBazaarCard
                    onClick={() => {setActive3(item.name); }}
                    style={{ backgroundColor: active3==item.name ? "#043B72" : "", color: active3==item.name ? "white" : "black"  }}
                elevation={1}>
                  <Box fontWeight="600" ml={1.25} fontSize={20}>
                    {item.name}
                  </Box>
                </StyledBazaarCard>
              </a>
          </Grid>
          )}
          <Container sx={{ mb: "20px" }} />
          <HorizonLine text="투자 유니버스 선택 (대분류)" />
         {categories3[active3].map((item, ind) =>
        <Grid item lg={3} md={6} sm={6} xs={12} key={ind}>
                <a>
                <StyledBazaarCard
                    onClick={() => {setActive4(item.name); setActive5(categories4[active4][0].name);  console.log('click 4'); }}
                    style={{ backgroundColor: active4==item.name ? "#043B72" : "", color: active4==item.name ? "white" : "black"  }}
                elevation={1}>
                  <Box fontWeight="600" ml={1.25} fontSize={20}>
                    {item.name}
                  </Box>
                </StyledBazaarCard>
              </a>
          </Grid>
          )}
        <Container sx={{ mb: "20px" }} />
          <HorizonLine text="투자 유니버스 선택 (소분류)" />
          <Grid container spacing={3}>
          <Grid item lg={2} md={2} sm={2} xs={2} xs>
          <ExplainCard onClick={handleOpenE}>
            <Box fontWeight="300" ml={1.25} color="#696969" fontSize={15}>
              {"유니버스 설명보기"}
            </Box>
           </ExplainCard>
           </Grid>
           </Grid>
      <Modal
        keepMounted
        open={openE}
        onClose={handleCloseE}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
        <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            ({active4} - {active5}) 유니버스
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            {portdata.explain}
          </Typography>
        </Box>
      </Modal>
         {categories4[active4].map((item, ind) =>
        <Grid item lg={12/5} md={3} sm={6} xs={12} key={ind}>
                <a>
                <StyledBazaarCard
                    onClick={() => {setActive5(item.name); console.log("click:",item.name); console.log('click 5'); setRMticker(["제외종목"]);}}
                    style={{ backgroundColor: active5==item.name ? "#043B72" : "", color: active5==item.name ? "white" : "black"  }}
                elevation={1}>
                  <Box fontWeight="600" ml={1.25} fontSize={20}>
                    {item.name}
                  </Box>
                </StyledBazaarCard>
              </a>
          </Grid>
          )}
        </Grid>
        <Container sx={{ mb: "20px" }} />
        <HorizonLine text="보유종목 세부" />
          {open? (
          <Grid container spacing={3}>
          <Grid item lg={12} md={12} sm={12} xs={12} >
          <div style={{height: 400}}>
            <ResponsiveTreeMapHtml
                onClick={(e) => {
                   console.log(e)
                   setRMticker(rmticker => [...rmticker, e.id])
                   console.log(rmticker)
                }
                }
                label="id"
                data={portdata.area}
                 tooltip={({ node }) => (
                   <strong>
                       {node.pathComponents.join(' / ')} : {node.formattedValue}%
                   </strong>
                )}
                identity="name"
                value="loc"
                valueFormat=".02s"
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                labelSkipSize={12}
                labelTextColor={{from: 'color', modifiers: [[ 'darker', 2]]}}
                parentLabelTextColor={{from: 'color',modifiers: [['darker',3]]}}
                colors={{ scheme: 'purple_blue' }}
                borderColor={{from: 'color',modifiers: [['darker', 0.1]]}}
            />
          </div>
          <Grid container spacing={3}>
          <Grid item lg={2} md={2} sm={2} xs={2} xs>
              <ExplainCard_wh>
                <Box fontWeight="400" ml={1.25} fontSize={15}>
                  {"편입종목수"}
                </Box>
              </ExplainCard_wh>
          </Grid>
          <Grid item lg={4} md={4} sm={6} xs={6} xs>
          <Slider
            value={typeof value === 'number' ? value : 50}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
          </Grid>
          <Grid item lg={4} md={4} sm={6} xs={6} xs>
           <MuiInput
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 10,
              max: 50,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
          </Grid>
          </Grid>
          </Grid>
          <Grid item lg={2} md={2} sm={2} xs={2} xs>
          <ExplainCard onClick={handleOpenF}>
            <Box fontWeight="300" ml={1.25} color="#696969" fontSize={15}>
              {"팩터스코어 설명보기"}
            </Box>
           </ExplainCard>
           </Grid>
      <Modal
        keepMounted
        open={openF}
        onClose={handleCloseF}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <CardMedia
            src={"/assets/images/port/factor.png"}
            component="img"
            title={"title"}
            sx={{
              maxWidth: "100%",
              margin: 0,
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </Box>
      </Modal>
              <Stack sx={{ height: 200 }} spacing={3} direction="row">
              <Stack item lg={4} sm={4} xs={4} lg={4} />
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

          <Container sx={{ mb: "40px" }} />
          <Grid container spacing={3}>
          {rmticker.map((ticker) => (<StyledBazaarCard
                onClick={() => {setRMticker((prev) => prev.filter(prevelem=>{return (prevelem=="제외종목" || prevelem!=ticker)}));}}
                style={{ backgroundColor: "black", color: "white"   }}
                elevation={1}>
                  <Box fontWeight="600" ml={1.25} fontSize={15}>
                    {ticker}
                  </Box>
          </StyledBazaarCard>))}
          </Grid>
          <Container sx={{ mb: "20px" }} />
          <HorizonLine text="초기 포트폴리오" />
            <Grid item xs={12} md={12} lg={12}>
                <ReactTable table={portdata.table} />
            </Grid>
          <Container sx={{ mb: "20px" }} />
            <Grid item xs={5.5} md={5.5} lg={5.5}>
            <HorizonLine text="섹터별 비중" />
             <div style={{height: 400}}>
                <Pie piedata={portdata.pie} />
              </div>
            </Grid>
            <Grid item xs={1} md={1} lg={1} />
            <Grid item xs={5.5} md={5.5} lg={5.5}>
            <HorizonLine text="국가별 비중" />
             <div style={{height: 400}}>
                <Pie piedata={portdata.pie_ctr} />
              </div>
            </Grid>
          <Container sx={{ mb: "20px" }} />
          <HorizonLine text="수익률 현황" />
          {/*<Grid item lg={12} md={12} sm={12} xs={12}>
            <ApexChart
        	type="line"
            series={portdata.rtn.data}
            options={{
                chart : {
                    height: 200,
                    width: 500,
                },
                xaxis: {
                    categories: portdata.rtn.xaxis,
                }
            }}>
            </ApexChart>
            </Grid>*/}
            <Grid item xs={12} md={12} lg={12}>
               <div style={{height: 300}}>
                  <Typography align="center">
                    수익률
                  </Typography>
                <Line linedata={portdata.rtn_new}/>
                </div>
            </Grid>
            <Container sx={{ mb: "20px" }} />
            <Grid item xs={12} md={12} lg={12}>
                <PeriodTable table={portdata.rtn_period} />
            </Grid>

          </Grid>) : (<div />)}
    </Container>;
};
export default Section10;