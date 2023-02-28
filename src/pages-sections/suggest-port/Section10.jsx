import Link from "next/link";
import { Box, Container, Grid, styled } from "@mui/material";
import LazyImage from "components/LazyImage";
import BazaarCard from "components/BazaarCard";
import HorizonLine from "components/HorizontalLine";
import CategoryIcon from "components/icons/Category";
import {httpGet, url} from "components/config";
import React, { useState } from "react";
import RowSpanning from "components/table";
import Pie from "components/chart/Piechart";
import table from "./table";
import pie from "./pie";
import CategorySectionHeader from "components/CategorySectionHeader";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { STATUS_OPTIONS, useDemoData, randomDesk, generateFilledQuantity, randomStatusOptions,renderProgress, renderStatus, renderEditProgress, renderEditStatus } from '@mui/x-data-grid-generator';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
//import Chart from "react-apexcharts";
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

const categories1 = [
    { name: "미래에셋 추천 포트폴리오"},
    { name: "변동성 알고리즘"},
    { name: "멀티에셋 인컴"},
    { name: "테마로테이션"},
    { name: "초개인화로보"},
    { name: "멀티에셋 모멘텀(국내)"},
    { name: "멀티에셋 모멘텀(해외)"},
];

const categories2 = [
    { name: "적극투자형"},
    { name: "위험중립형"},
    { name: "안정추구형"},
];
const [active1, setActive1] = useState("추천 포트폴리오");
const [active2, setActive2] = useState("미래에셋 추천 포트폴리오");
const [active3, setActive3] = useState("적극투자형");
const [tabledata, setTableData] = useState(table);
const [tablepage, setTablePage] = useState(20);
typeof window !== 'undefined' ? sessionStorage.setItem("pages", 20) : null;
const [piedata, setPieData] = useState(pie);
const [rtndata, setRtnData] = useState(null);
const series = [
    {
      name: "Guests",
      data: [19, 22, 20, 26]
    }
  ];
  const options = {
    xaxis: {
      categories: ["2019-05-01", "2019-05-02", "2019-05-03", "2019-05-04"]
    }
  };
const columns = [
    { field: "type", headerName: "구분", width: 210 },
    { field: "wgt1", headerName: "비중", width: 70 },
    { field: "ticker", headerName: "종목명", width: 249 },
    { field: "wgt2", headerName: "비중", type: "number", width: 70 },
  ];



function handleClick1(val) {
    console.log(val);
    setActive2(val);
    console.log(active2);
    fetch(url.concat(`/suggest_port/${val}_${active3}`), { method: 'GET' })
    .then(data => data.json())
    .then(json => {setTableData(json.table); setPieData(json.pie); setTablePage(json.tablepage); sessionStorage.setItem("pages", json.tablepage);})
}

function handleClick2(val) {
    console.log(val);
    setActive3(val);
    console.log(active3);
    fetch(url.concat(`/suggest_port/${active2}_${val}`), { method: 'GET' })
    .then(data => data.json())
    .then(json => {setTableData(json.table); setPieData(json.pie); setTablePage(json.tablepage); sessionStorage.setItem("pages", json.tablepage);})
}

  return <Container sx={{
    mb: "100px"
  }}>
      <CategorySectionHeader seeMoreLink="" title="" />
        <Container sx={{ mb: "40px" }} />
        <HorizonLine text="추천 포트폴리오" />
        <Grid container spacing={3}>
        {categories.map((item, ind) =>
            <Link href={item.slug}>
            <Grid item lg={4} md={6} sm={6} xs={12} key={ind}>
                <a>
                <StyledBazaarCard
                    onClick={() => setActive1(item.name)}
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
        </Grid>

        <Container sx={{ mb: "40px" }} />

        <Grid container spacing={3}>
          <HorizonLine text="펀드 선택" />
         {categories1.map((item, ind) =>
          <Grid item lg={3} md={4} sm={4} xs={12} key={ind}>
            <a>
            <StyledBazaarCard
                onClick={() => handleClick1(item.name)}
                style={{ backgroundColor: active2==item.name ? "#043B72" : "", color: active2==item.name ? "white" : "black"  }}
                elevation={1}>
              <Box fontWeight="600" ml={1.25} fontSize={20}>
                {item.name}
              </Box>
            </StyledBazaarCard>
            </a>
          </Grid>
          )}
          </Grid>

        <Container sx={{ mb: "40px" }} />
        <Grid container spacing={3}>
          <HorizonLine text="위험 성향 선택" />
           {categories2.map((item, ind) =>
            <Grid item lg={4} md={4} sm={4} xs={4} key={ind}>
                <a>
                <StyledBazaarCard
                    onClick={() => handleClick2(item.name)}
                    style={{ backgroundColor: active3==item.name ? "#043B72" : "", color: active3==item.name ? "white" : "black"  }}
                    elevation={1}>
                  <Box fontWeight="600" ml={1.25} fontSize={20}>
                    {item.name}
                  </Box>
                </StyledBazaarCard>
              </a>
            </Grid>
            )}
          </Grid>

          <Container sx={{ mb: "40px" }} />
          <Grid container spacing={3}>
          <HorizonLine text="포트폴리오 상세" />
            <Grid item xs={6} md={6} lg={6}>
             <div style={{height: 400}}>
                <Pie piedata={piedata} />
             </div>
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
                <RowSpanning table={tabledata} pageSize={tablepage} columns={columns} />
            </Grid>
          </Grid>
    </Container>;
};
export default Section10;