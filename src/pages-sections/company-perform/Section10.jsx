import Link from "next/link";
import { Box, Container, Grid, styled } from "@mui/material";
import LazyImage from "components/LazyImage";
import ReactTable from "components/react-table/Perform-Table";
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


const [tabledata, setTableData] = useState(table);
const [tablepage, setTablePage] = useState(20);

useEffect(()=>{
    fetch(url.concat(`/company-perform-table`), { method: 'GET' })
    .then(data => data.json())
    .then(json => {setTableData(json.table); console.log(json)})
},[])

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

    </Container>;
};
export default Section10;