import Link from "next/link";
import PeriodTable from "components/react-table/Period-Table";
import CardMedia from "@mui/material/CardMedia";
import { Modal, Button, debounce, Checkbox, TextField, IconButton, FormControlLabel, ClickAwayListener } from "@mui/material";
import { Box, Container, Grid, styled } from "@mui/material";
import Line from "components/chart/Linechart";

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
import ReactTable from "components/react-table/PortS-Table";
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


const Section10 = ({
  categories
}) => {

const categories1 = [
    { name: "미래에셋 추천 포트폴리오(국내)"},
    { name: "미래에셋 추천 포트폴리오(해외)"},
    { name: "미래에셋 추천 포트폴리오(연금)"},
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
const [active2, setActive2] = useState("미래에셋 추천 포트폴리오(국내)");
const [active3, setActive3] = useState("적극투자형");
const [linedata, setLineData] = useState(null);
const [tabledata, setTableData] = useState(null);
const [tabledataP, setTableDataP] = useState(null);
const [tabledataN, setTableDataN] = useState(null);
const [tablepage, setTablePage] = useState(20);
typeof window !== 'undefined' ? sessionStorage.setItem("pages", 20) : null;
const [piedata, setPieData] = useState(pie);
const [rtndata, setRtnData] = useState(null);
const [open, setOpen] = React.useState(false);
const [openport, setOpenPort] = React.useState(false);
const [openF, setOpenF] = React.useState(false);
const [openR, setOpenR] = React.useState(false);
const [image, setImage] = React.useState("00");
const [imageR, setImageR] = React.useState("1");
const handleOpen = () => setOpenF(true);
const handleClose = () => setOpenF(false);
const handleOpenR = () => setOpenR(true);
const handleCloseR = () => setOpenR(false);
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
    console.log(url.concat(`/suggest_port/${val}_${active3}`));
    fetch(url.concat(`/suggest_port/${val}_${active3}`), { method: 'GET' })
    .then(data => data.json())
    .then(json => {console.log(json.tableN); setLineData(json.line); setTableDataN(json.tableN); setTableData(json.table); setTableDataP(json.tableP); setPieData(json.pie); setTablePage(json.tablepage); sessionStorage.setItem("pages", json.tablepage); setImage(json.imagenum); setImageR(json.risknum); setOpen(true);
    if(active2!="미래에셋"){setOpenPort(true)}})
}

function handleClick2(val) {
    console.log(val);
    setActive3(val);
    console.log(url.concat(`/suggest_port/${active2}_${val}`));
    fetch(url.concat(`/suggest_port/${active2}_${val}`), { method: 'GET' })
    .then(data => data.json())
    .then(json => {console.log(json.tableN); setLineData(json.line); setTableDataN(json.tableN); setTableData(json.table); setTableDataP(json.tableP); setPieData(json.pie); setTablePage(json.tablepage); sessionStorage.setItem("pages", json.tablepage); setImage(json.imagenum); setImageR(json.risknum);setOpen(true);
    if(active2!="미래에셋"){setOpenPort(true)}})
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
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <ExplainCard_wh>
            <Box fontWeight="100" ml={1.25} color="#696969" fontSize={15}>
              {"미래에셋 자산운용에서 추천하는 포트폴리오를 확인하실 수 있습니다."}
            </Box>
          </ExplainCard_wh>
          </Grid>
           <Container sx={{ mb: "10px" }} />
        </Grid>

        <Container sx={{ mb: "40px" }} />
        <Grid container spacing={3}>
            <Grid container spacing={3}>
              <HorizonLine text="펀드 선택" />
              <Grid item lg={2} md={4} sm={5} xs={6}>
              <ExplainCard onClick={handleOpen}>
                <Box fontWeight="300" ml={1.25} color="#696969" fontSize={15}>
                  {"펀드 설명보기"}
                </Box>
              </ExplainCard>
            </Grid>
          </Grid>
       <Modal
        keepMounted
        open={openF}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <CardMedia
            src={"/assets/images/port/port_"+image+".png"}
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
          <Grid container spacing={3}>
            <Grid item lg={2} md={4} sm={5} xs={6}>
              <ExplainCard onClick={handleOpenR}>
                <Box fontWeight="100" ml={1.25} color="#696969" fontSize={15}>
                  {"위험성향 설명보기"}
                </Box>
              </ExplainCard>
                </Grid>
            </Grid>
        <Modal
        keepMounted
        open={openR}
        onClose={handleCloseR}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <CardMedia
            src={"/assets/images/port/risk_"+imageR+".png"}
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
          {openport? (
          <Grid container spacing={3}>
          <Container sx={{ mb: "40px" }} />
          <HorizonLine text="포트폴리오 상세(2023-02-28 기준)" />
          <Container sx={{ mb: "40px" }} />
            <Grid item xs={6} md={6} lg={6}>
             <div style={{height: 400}}>
                <Pie piedata={piedata} />
             </div>
            </Grid>
            {/*<Grid item xs={6} md={6} lg={6}>
                <RowSpanning table={tabledata} pageSize={tablepage} columns={columns} />
            </Grid>*/}
            <Grid item xs={6} md={6} lg={6}>
               <div style={{height: 300}}>
                  <Typography align="center">
                    수익률
                  </Typography>
                <Line linedata={linedata}/>
                </div>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
                <PeriodTable table={tabledataP} />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
                <ReactTable table={tabledataN} />
            </Grid>
          </Grid>):
          (<div> </div>)}

          {open==true&&openport==false? (
          <Grid container spacing={3}>
          <Container sx={{ mb: "40px" }} />
          <HorizonLine text="포트폴리오 상세(2023-02-28 기준)" />
            <Grid item xs={6} md={6} lg={6}>
             <div style={{height: 400}}>
                <Pie piedata={piedata} />
             </div>
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
                <ReactTable table={tabledataN} />
            </Grid>
          </Grid>):
          (<div> </div>)}
          </Grid>
    </Container>;
};
export default Section10;