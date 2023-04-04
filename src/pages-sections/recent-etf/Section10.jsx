import Link from "next/link";
import { Box, Container, Grid, styled } from "@mui/material";
import LazyImage from "components/LazyImage";
import ReactTable from "components/react-table/React-Table";
import BazaarCard from "components/BazaarCard";
import HorizonLine from "components/HorizontalLine";
import CategoryIcon from "components/icons/Category";
import {httpGet, url} from "components/config";
import React, { useState,useEffect } from "react";
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
    { name: "미래에셋 추천 포트폴리오(국내)"},
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

const [tabledata, setTableData] = useState(table);
const [tablepage, setTablePage] = useState(20);

useEffect(()=>{
    fetch(url.concat(`/recent_etf`), { method: 'GET' })
    .then(data => data.json())
    .then(json => {setTableData(json.table); console.log(json)})
},[])
//function handleClick1(val) {
//    console.log(val);
//    setActive2(val);
//    console.log(active2);
//    fetch(url.concat(`/suggest_port/${val}_${active3}`), { method: 'GET' })
//    .then(data => data.json())
//    .then(json => {setTableData(json.table); setPieData(json.pie); setTablePage(json.tablepage); sessionStorage.setItem("pages", json.tablepage);})
//}
//
//function handleClick2(val) {
//    console.log(val);
//    setActive3(val);
//    console.log(active3);
//    fetch(url.concat(`/suggest_port/${active2}_${val}`), { method: 'GET' })
//    .then(data => data.json())
//    .then(json => {setTableData(json.table); setPieData(json.pie); setTablePage(json.tablepage); sessionStorage.setItem("pages", json.tablepage);})
//}
const columns = [
    { field: "group", headerName: "그룹", width: 150 },
    { field: "ticker", headerName: "티커", width: 150 },
    { field: "ma", headerName: "운용사", width: 250 },
    { field: "name", headerName: "ETF명", width: 250 },
    { field: "mcap", headerName: "시가총액", width: 100 },
    { field: "week", headerName: "1주성과", type: "number", width: 90 },
    { field: "month", headerName: "1달성과", type: "number", width: 90 },
    { field: "initdate", headerName: "최초 상장일", type: "number", width: 147 },
  ];

  return <Container sx={{
    mb: "100px"
  }}>
      <CategorySectionHeader seeMoreLink="" title="" />
          <Container sx={{ mb: "40px" }} />
          <Grid container spacing={3}>
          <HorizonLine text="최근 출시된 ETF" />
            <Grid item xs={12} md={12} lg={12}>
                <ReactTable table={tabledata} />
            </Grid>
          </Grid>

          {/*<Grid container spacing={3}>
          <HorizonLine text="최근 출시된 ETF" />
            <Grid item xs={12} md={12} lg={12}>
                <RowSpanning table={tabledata} pageSize={tablepage} columns={columns} />
            </Grid>
          </Grid>*/}
    </Container>;
};
export default Section10;