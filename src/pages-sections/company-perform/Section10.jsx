import Link from "next/link";
import Select from 'react-select';
import { Box, Container, Grid, styled } from "@mui/material";
import LazyImage from "components/LazyImage";
import ReactTable from "components/react-table/React-Table";
import BazaarCard from "components/BazaarCard";
import HorizonLine from "components/HorizontalLine";
import CategoryIcon from "components/icons/Category";
import {httpGet, url} from "components/config";
import React, { useState,useEffect } from "react";
import Line from "components/chart/Linechart";
import RowSpanning from "components/table";
import Pie from "components/chart/Piechart";
import table from "./table";
import pie from "./pie";
import Typography from '@material-ui/core/Typography';
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

const [option, setOption] = useState([]);
const [open, setOpen] = useState(false);
const [linedata, setLine] = useState(table);


useEffect(()=>{
    fetch(url.concat(`/company`), { method: 'GET' })
    .then(data => data.json())
    .then(json => {setOption(json.list);})
},[])

function getPerform(value) {
    const nm_list = [value.value]
    {/*for (let i = 0; i < value.length; i++) {
      nm_list.push(value[i].value)
      console.log(value[i].value)
    }*/}
    console.log(url.concat(`/company-perform/${nm_list.join('|')}`))
    fetch(url.concat(`/company-perform/${nm_list.join('|')}`), { method: 'GET' })
    .then(data => data.json())
    .then(json => {setLine(json); console.log(json); setOpen(true)})
}

{/*useEffect(()=>{
    console.log(option)
    const nm_list = []
    for (let i = 0; i < option.length; i++) {
      nm_list.push(option[i].value)
      console.log(option[i].value)
    }
    fetch(url.concat(`/company-perform/${option.join('|')}`), { method: 'GET' })
    .then(data => data.json())
    .then(json => {setLine(json.line); console.log(json.line)})
},[option])*/}


  return <Container sx={{
    mb: "100px"
  }}>
      <CategorySectionHeader seeMoreLink="" title="" />
          <Container sx={{ mb: "40px" }} />
          <Grid container spacing={3}>
          <HorizonLine text="기업 실적발표 한눈에보기" />
          <Grid item xs={12} md={12} lg={12}>
            <Select
                // defaultValue={[option[1], option[4]]}
                // isMulti
                name="colors"
                options={option}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(e) => {console.log(e); getPerform(e);}}
              />
            </Grid>
            {open? <Grid item xs={12} md={12} lg={12}>
            <Typography align="center">
                주가
            </Typography>
            <div style={{height: 300}}>
            <Line linedata={linedata.line_close}/>
            </div>
            <Container sx={{ mb: "40px" }} />
            <Typography align="center">
                판매액
            </Typography>
            <div style={{height: 300}}>
            <Line linedata={linedata.line_sale}/>
            </div>
            <Container sx={{ mb: "40px" }} />
            <Typography align="center">
                영업이익
            </Typography>
            <div style={{height: 300}}>
            <Line linedata={linedata.line_op}/>
            </div>
            <Container sx={{ mb: "40px" }} />
            <Typography align="center">
                순이익
            </Typography>
            <div style={{height: 300}}>
            <Line linedata={linedata.line_ni}/>
            </div>
            </Grid>:
            <div></div>}
          </Grid>

    </Container>;
};
export default Section10;