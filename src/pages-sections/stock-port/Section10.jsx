import Link from "next/link";
import { Box, Container, Grid, styled } from "@mui/material";
import LazyImage from "components/LazyImage";
import BazaarCard from "components/BazaarCard";
import HorizonLine from "components/HorizontalLine";
import CategoryIcon from "components/icons/Category";
import RowSpanning from "components/table";
import MyResponsiveTreeMapHtml  from "components/treemap";
import Pie from "components/chart/Piechart";
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
import dynamic from 'next/dynamic'

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


const Section10 = ({
  categories
}) => {

const [active1, setActive1] = useState("주식포트폴리오 직접생성");
const [active2, setActive2] = useState("글로벌 주식");
const [active3, setActive3] = useState("테마");
const [active4, setActive4] = useState("그린");
const [active5, setActive5] = useState("배터리");
const [open, setOpen] = useState(false);
const [portdata, setPortData] = useState("");
const [rmticker, setRMticker] = useState(["제외종목"]);

function getAreaData() {
    console.log(url.concat(`/di_theme_univ/${active4}_${active5}_${rmticker.join('|')}`))
    fetch(url.concat(`/di_theme_univ/${active4}_${active5}_${rmticker.join('|')}`), { method: 'GET' })
    .then(data => data.json())
    .then(json => {setPortData(json); console.log(json)})
}

useEffect(() => {
    console.log(categories3[active3][0].name)
    setActive4(categories3[active3][0].name)
}, [active3]);

useEffect(() => {
    console.log(categories4[active4][0].name)
    setActive5(categories4[active4][0].name)
}, [active4]);

useEffect(() => {
    console.log(rmticker)
    console.log(url.concat(`/di_theme_univ/${active4}_${active5}_${rmticker.join('|')}`))
    fetch(url.concat(`/di_theme_univ/${active4}_${active5}_${rmticker.join('|')}`), { method: 'GET' })
    .then(data => data.json())
    .then(json => {setPortData(json); console.log(json)})
}, [rmticker]);

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
          <Container sx={{ mb: "20px" }} />
          <HorizonLine text="기본 지수 선택" />
         {categories1.map((item, ind) =>
        <Grid item lg={4} md={6} sm={6} xs={12} key={ind}>
                <a>
                <StyledBazaarCard
                    onClick={() => {setActive2(item.name); setRMticker(["제외종목"]);}}
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
                    onClick={() => {setActive3(item.name); setRMticker(["제외종목"]);}}
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
                    onClick={() => {setActive4(item.name); setActive5(categories4[active4][0]); getAreaData(); setOpen(true); setRMticker(["제외종목"]);}}
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
         {categories4[active4].map((item, ind) =>
        <Grid item lg={12/5} md={3} sm={6} xs={12} key={ind}>
                <a>
                <StyledBazaarCard
                    onClick={() => {setActive5(item.name); console.log("click:",item.name); getAreaData(); setOpen(true); setRMticker(["제외종목"]);}}
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
          </Grid>
          {rmticker.map((ticker) => (<StyledBazaarCard
                onClick={() => {setRMticker((prev) => prev.filter(prevelem=>{return (prevelem=="제외종목" || prevelem!=ticker)}));}}
                style={{ backgroundColor: "black", color: "white"   }}
                elevation={1}>
                  <Box fontWeight="600" ml={1.25} fontSize={20}>
                    {ticker}
                  </Box>
          </StyledBazaarCard>))}
          <Container sx={{ mb: "20px" }} />
          <HorizonLine text="수익률 현황" />
          <Grid item lg={12} md={12} sm={12} xs={12}>
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
            </Grid>
          </Grid>) : (<div />)}
    </Container>;
};
export default Section10;