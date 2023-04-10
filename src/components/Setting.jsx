import { useState } from "react";
import { useRouter } from "next/router";
import { Close, Settings, Face4 } from "@mui/icons-material";
import { ThemeProvider } from 'styled-components';
import { Box, Avatar, Button, styled, Divider, Tooltip, IconButton, ClickAwayListener } from "@mui/material";
import { H6 } from "./Typography";
import { FlexBox } from "./flex-box";
import useSettings from "hooks/useSettings";
import ChatBot from 'react-simple-chatbot';

// custom styled components
const theme = {
  background: '#f5f8fb',
  fontFamily: 'Helvetica Neue',
  headerBgColor: '#EF6C00',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#EF6C00',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};
const MainContainer = styled(Box)(({
  theme
}) => ({
  top: 50,
  right: 50,
  zIndex: 1501,
  position: "fixed",
  [theme.breakpoints.down("md")]: {
    display: "none"
  }
}));
const StyledIconButton = styled(IconButton)(({
  theme
}) => ({
  right: 50,
  zIndex: 99,
  bottom: 50,
  padding: 12,
  color: "#f5f8fb",
  position: "fixed",
  borderRadius: "50%",
  boxShadow: theme.shadows[12],
  backgroundColor: theme.palette.primary.main,
  ":hover": {
    backgroundColor: theme.palette.primary.main
  }
}));
const BodyWrapper = styled(Box, {
  shouldForwardProp: props => props !== "showBody"
})(({
  theme,
  showBody
}) => ({
  overflow: "auto",
  borderRadius: "4px",
  backgroundColor: "white",
  opacity: showBody ? 1 : 0,
  width: showBody ? 400 : 0,
  padding: showBody ? 24 : 0,
  boxShadow: theme.shadows[3],
  transition: "transform 0.4s",
  maxHeight: showBody ? "calc(100vh - 100px)" : 0,
  transform: `translateY(${showBody ? 0 : "10px"})`
}));
const StyledAvatar = styled(Avatar)({
  flexGrow: 1,
  height: 50,
  width: "45%",
  cursor: "pointer",
  borderRadius: "10px",
  ":last-of-type": {
    flexGrow: 0
  },
  ":hover": {
    "&::after": {
      opacity: 0.5
    }
  },
  "::after": {
    opacity: 0,
    content: '""',
    width: "100%",
    height: "100%",
    background: "black",
    position: "absolute",
    transition: "all 0.3s"
  }
});
const Setting = () => {
  const {
    push
  } = useRouter();
  const {
    updateSettings,
    settings
  } = useSettings();
  const [showBody, setShowBody] = useState(false);
  const [port1, setPort1] = useState(0);
  const [port2, setPort2] = useState(0);
  const [port3, setPort3] = useState(0);

  return <ClickAwayListener onClickAway={() => setShowBody(false)}>
      <MainContainer>
        <Tooltip title="AI에게 물어보세요." placement="left">
          <StyledIconButton onClick={() => setShowBody(state => !state)}>
            {!showBody && <Face4 />}
            {showBody && <Close />}
          </StyledIconButton>
        </Tooltip>
        <BodyWrapper showBody={showBody ? 1 : 0}>
        <ThemeProvider theme={theme}>
        <ChatBot
          steps={[
            {
              id: '1',
              message: '안녕하세요, \n저는 미래에셋자산운용의 AI비서입니다. \n어떤 포트폴리오를 만들기 원하시나요?',
              trigger: '2'
            },
             {
                id: '2',
                options: [
                  { value: 1, label: '미래에셋이 추천하는 포트폴리오', trigger: '3-1' },
                  { value: 2, label: '테마지수에 투자하기', trigger: '3-2' },
                  { value: 3, label: '전략지수에 투자하기', trigger: '3-3' },
//                  { value: 4, label: '현재 국면에 맞춰 자산배분하기', trigger: '3-4' },
                ]
              },
              {
                id: '3-1',
                message: '미래에셋이 추천하는 포트폴리오를 선택해주셨군요! 투자를 하실때 어떤게 가장 중요하신가요?',
                trigger: '4-1'
              },
              {
                id: '3-2',
                message: '테마지수로 투자하기를 선택해주셨군요! 어떤 테마에 관심이 있으신까요?',
                trigger: '4-2'
              },
              {
                id: '3-3',
                message: '전략지수에 투자하기를 선택해주셨군요! 어떤 전략에 관심이 있으신가요?',
                trigger: '4-3'
              },
              {
                id: '3-4',
                message: '자산배분으로 투자하기를 선택해주셨군요! 투자를 하실때 어떤게 가장 중요하신가요?',
                trigger: '4-4'
              },
              {
                id: '4-1',
                options: [
                  { value: '1-1', label: '전문가들의 추천', trigger: '5-1' },
                  { value: '1-5', label: '꾸준한 배당', trigger: '5-2' },
                  { value: '1-7', label: '개인 맞춤형', trigger: '5-3' },
                  { value: '1-6', label: '요즘 핫한 테마', trigger: '5-4' },
                  { value: '1-8', label: '모멘텀 전략', trigger: '5-5' },
                  { value: '1-4', label: '변동성 전략', trigger: '5-6' },
                ],
              },
              {
                id: '4-2',
                options: [
                  { value: '그린', label: '친환경 산업에 투자', trigger: '5-7' },
                  { value: '디지털', label: '디지털 산업에 투자', trigger: '5-8' },
                  { value: '바이오', label: '바이오 산업에 투자', trigger: '5-9' },
                  { value: '인플레이션', label: '인플레이션에도 강한 산업에 투자', trigger: '5-10' },
                  { value: '기타', label: '그 외 산업에 투자', trigger: '5-11' },
                ],
              },
              {
                id: '4-3',
                options: [
                  { value: '펀더멘탈', label: '펀더멘탈이 강한 기업에 투자', trigger: '5-12' },
                  { value: '기업현금흐름', label: '현금흐름이 좋은 기업에 투자', trigger: '5-13' },
                  { value: '매출 및 배당성장', label: '매출성장성과 배당성장성이 높은 기업에 투자', trigger: '5-14' },
                  { value: '인플레이션 수혜/피해', label: '인플레이션과 관련이 높은 기업에 투자', trigger: '5-15' },
                ],
              },
              {
                id: '4-4',
                options: [
                  { value: 1, label: '주식 60% + 채권 40%' },
                  { value: 2, label: '꾸준한 배당'},
                  { value: 3, label: '개인 맞춤형'},
                  { value: 4, label: '요즘 핫한 테마'},
                  { value: 5, label: '모멘텀 전략'},
                  { value: 6, label: '변동성 전략'},
                ],
              },
              {
                id: '5-1',
                message: '[{previousValue}] 유니버스를 선택해주세요.',
                trigger: '6-1'
              },
              {
                id: '5-2',
                message: '성향을 선택해주세요',
                trigger: '6-2'
              },
              {
                id: '5-3',
                message: '성향을 선택해주세요',
                trigger: '6-3'
              },
              {
                id: '5-4',
                message: '성향을 선택해주세요',
                trigger: '6-4'
              },
              {
                id: '5-5',
                message: '[{previousValue}] 유니버스를 선택해주세요.',
                trigger: '6-5'
              },
              {
                id: '5-6',
                message: '성향을 선택해주세요.',
                trigger: '6-6'
              },
              {
                id: '5-7',
                message: '세부 테마를 선택해주세요.',
                trigger: '6-7'
              },
              {
                id: '5-8',
                message: '세부 테마를 선택해주세요.',
                trigger: '6-8'
              },
              {
                id: '5-9',
                message: '세부 테마를 선택해주세요.',
                trigger: '6-9'
              },
              {
                id: '5-10',
                message: '세부 테마를 선택해주세요.',
                trigger: '6-10'
              },
              {
                id: '5-11',
                message: '세부 테마를 선택해주세요.',
                trigger: '6-11'
              },
              {
                id: '5-12',
                message: '재무재표가 좋은 종목들로 구성된 포트폴리오가 준비되었어요.',
                trigger: '6-12'
              },
              {
                id: '5-13',
                message: '세부 전략을 선택해주세요.',
                trigger: '6-13'
              },
              {
                id: '5-14',
                message: '매출과 배당성장성이 좋은 포트폴리오가 준비되었어요.',
                trigger: '6-14'
              },
             {
                id: '5-15',
                message: '세부 전략을 선택해주세요.',
                trigger: '6-15'
              },
              {
                id: '6-1',
                options: [
                  { value: '1-1', label: '국내', trigger: '7-11' },
                  { value: '1-2', label: '해외', trigger: '7-12' },
                  { value: '1-3', label: '연금', trigger: '7-13' },
                ],
              },
              {
                id: '6-2',
                options: [
                  { value: '1-5-1', label: '적극투자형', trigger: '7-21' },
                  { value: '1-5-2', label: '위험중립형', trigger: '7-22' },
                  { value: '1-5-3', label: '안정추구형', trigger: '7-23' },
                ],
              },
              {
                id: '6-3',
                options: [
                  { value: '1-7-1', label: '적극투자형', trigger: '7-31' },
                  { value: '1-7-2', label: '위험중립형', trigger: '7-32' },
                  { value: '1-7-3', label: '안정추구형', trigger: '7-33' },
                ],
              },
              {
                id: '6-4',
                options: [
                  { value: '1-6-1', label: '적극투자형', trigger: '7-41' },
                  { value: '1-6-2', label: '위험중립형', trigger: '7-42' },
                  { value: '1-6-3', label: '안정추구형', trigger: '7-43' },
                ],
              },
              {
                id: '6-5',
                options: [
                  { value: '1-8', label: '국내', trigger: '7-51' },
                  { value: '1-9', label: '해외', trigger: '7-52' },
                ],
              },
              {
                id: '6-6',
                options: [
                  { value: '1-2-1', label: '적극투자형', trigger: '7-61' },
                  { value: '1-2-2', label: '위험중립형', trigger: '7-62' },
                  { value: '1-2-3', label: '안정추구형', trigger: '7-63' },
                ],
              },
              {
                id: '6-7',
                options: [
                  { value: '2-1-1', label: '배터리', trigger: '7-71' },
                  { value: '2-1-2', label: '수소', trigger: '7-72' },
                  { value: '2-1-3', label: '수자원', trigger: '7-73' },
                  { value: '2-1-3', label: '스마트그리드', trigger: '7-74' },
                  { value: '2-1-3', label: '전기차', trigger: '7-75' },
                  { value: '2-1-3', label: '중국친환경', trigger: '7-76' },
                  { value: '2-1-3', label: '친환경금속', trigger: '7-77' },
                  { value: '2-1-3', label: '친환경종합', trigger: '7-78' },
                  { value: '2-1-3', label: '태양광', trigger: '7-79' },
                  { value: '2-1-3', label: '폐기물', trigger: '7-710' },
                  { value: '2-1-3', label: '풍력', trigger: '7-711' },
                  { value: '2-1-3', label: '원자력', trigger: '7-712' },
                ],
              },
              {
                id: '6-8',
                options: [
                  { value: '2-2-1', label: '5G', trigger: '7-81' },
                  { value: '2-2-2', label: 'AI,로보', trigger: '7-82' },
                  { value: '2-2-3', label: 'Arg Tech', trigger: '7-83' },
                  { value: '2-2-4', label: '게임', trigger: '7-84' },
                  { value: '2-2-5', label: '반도체', trigger: '7-85' },
                  { value: '2-2-6', label: '블록체인.NFT', trigger: '7-86' },
                  { value: '2-2-7', label: '사이버보안', trigger: '7-87' },
                  { value: '2-2-8', label: '원격의료', trigger: '7-88' },
                  { value: '2-2-9', label: '인터넷', trigger: '7-89' },
                  { value: '2-2-10', label: '클라우드', trigger: '7-810' },
                  { value: '2-2-11', label: '플랫폼', trigger: '7-811' },
                  { value: '2-2-12', label: '핀테크', trigger: '7-812' },
                  { value: '2-2-13', label: 'IOT', trigger: '7-813' },
                ],
              },
              {
                id: '6-9',
                options: [
                  { value: '2-3-1', label: '고령화', trigger: '7-91' },
                  { value: '2-3-2', label: '바이오텍', trigger: '7-92' },
                  { value: '2-3-3', label: '의료기기', trigger: '7-93' },
                ],
              },
              {
                id: '6-10',
                options: [
                  { value: '2-4-1', label: '금리인상', trigger: '7-101' },
                  { value: '2-4-2', label: '달러강세', trigger: '7-102' },
                  { value: '2-4-3', label: '원자재', trigger: '7-103' },
                  { value: '2-4-5', label: '인프라', trigger: '7-104' },
                  { value: '2-4-6', label: '퀄리티고배당', trigger: '7-105' },
                  { value: '2-4-7', label: '농업', trigger: '7-106' },
                ],
              },
              {
                id: '6-11',
                options: [
                  { value: '2-5-1', label: '대마초', trigger: '7-111' },
                  { value: '2-5-2', label: '반려동물', trigger: '7-112' },
                  { value: '2-5-3', label: '우주', trigger: '7-113' },
                  { value: '2-5-5', label: '자원', trigger: '7-114' },
                  { value: '2-5-6', label: '수목', trigger: '7-115' },
                ],
              },
              {
                id: '6-12',
                component: (
               <Button href="/stock-port/전략_펀더멘탈_건전한 재무재표 전략지수" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '6-13',
                options: [
                  { value: '2-7-1', label: '주주환원지수', trigger: '7-121' },
                  { value: '2-7-2', label: 'Capex와 R&D 지수', trigger: '7-122' },
                ],
              },
              {
                id: '6-14',
                component: (
               <Button href="/stock-port/전략_매출 및 배당성장_배당성장주" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '6-15',
                options: [
                  { value: '2-9-1', label: '인플레이션 수혜기업', trigger: '7-131' },
                  { value: '2-9-2', label: '인플레이션 피해기업', trigger: '7-132' },
                ],
              },
              {
                id: '7',
                component: (
               <Button href="/suggest-port/sample" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-11',
                message: '성향을 선택해주세요',
                trigger: '8-1'
              },
              {
                id: '8-1',
                options: [
                  { value: '추천_미래에셋 추천 포트폴리오(국내)_적극투자형', label: '적극투자형', trigger: '9-1' },
                  { value: '추천_미래에셋 추천 포트폴리오(국내)_위험중립형', label: '위험중립형', trigger: '9-2' },
                  { value: '추천_미래에셋 추천 포트폴리오(국내)_안정추구형', label: '안정추구형', trigger: '9-3' },
                ],
              },
              {
                id: '7-12',
                message: '성향을 선택해주세요',
                trigger: '8-2'
              },
              {
                id: '8-2',
                options: [
                  { value: '추천_미래에셋 추천 포트폴리오(해외)_적극투자형', label: '적극투자형', trigger: '9-4' },
                  { value: '추천_미래에셋 추천 포트폴리오(해외)_위험중립형', label: '위험중립형', trigger: '9-5' },
                  { value: '추천_미래에셋 추천 포트폴리오(해외)_안정추구형', label: '안정추구형', trigger: '9-6' },
                ],
              },
              {
                id: '7-13',
                message: '성향을 선택해주세요',
                trigger: '8-3'
              },
              {
                id: '8-3',
                options: [
                  { value: '추천_미래에셋 추천 포트폴리오(연금)_적극투자형', label: '적극투자형', trigger: '9-7' },
                  { value: '추천_미래에셋 추천 포트폴리오(연금)_위험중립형', label: '위험중립형', trigger: '9-8' },
                  { value: '추천_미래에셋 추천 포트폴리오(연금)_안정추구형', label: '안정추구형', trigger: '9-9' },
                ],
              },
              {
                id: '7-21',
                component: (
               <Button href="/suggest-port/추천_멀티에셋 인컴_적극투자형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-22',
                component: (
               <Button href="/suggest-port/추천_멀티에셋 인컴_위험중립형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-23',
                component: (
               <Button href="/suggest-port/추천_멀티에셋 인컴_안정추구형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
             {
                id: '7-31',
                component: (
               <Button href="/suggest-port/추천_초개인화로보_적극투자형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-32',
                component: (
               <Button href="/suggest-port/추천_초개인화로보_위험중립형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-33',
                component: (
               <Button href="/suggest-port/추천_초개인화로보_안정추구형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-41',
                component: (
               <Button href="/suggest-port/추천_테마로테이션_적극투자형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-42',
                component: (
               <Button href="/suggest-port/추천_테마로테이션_위험중립형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-43',
                component: (
               <Button href="/suggest-port/추천_테마로테이션_안정추구형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-51',
                message: '성향을 선택해주세요',
                trigger: '8-4'
              },
              {
                id: '8-4',
                options: [
                  { value: '추천_멀티에셋 모멘텀(국내)_적극투자형', label: '적극투자형', trigger: '9-10' },
                  { value: '추천_멀티에셋 모멘텀(국내)_위험중립형', label: '위험중립형', trigger: '9-11' },
                  { value: '추천_멀티에셋 모멘텀(국내)_안정추구형', label: '안정추구형', trigger: '9-12' },
                ],
              },
              {
                id: '7-52',
                message: '성향을 선택해주세요',
                trigger: '8-5'
              },
              {
                id: '8-5',
                options: [
                  { value: '추천_멀티에셋 모멘텀(해외)_적극투자형', label: '적극투자형', trigger: '9-13' },
                  { value: '추천_멀티에셋 모멘텀(해외)_위험중립형', label: '위험중립형', trigger: '9-14' },
                  { value: '추천_멀티에셋 모멘텀(해외)_안정추구형', label: '안정추구형', trigger: '9-15' },
                ],
              },
              {
                id: '7-61',
                component: (
               <Button href="/suggest-port/추천_변동성 알고리즘_적극투자형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-62',
                component: (
               <Button href="/suggest-port/추천_변동성 알고리즘_위험중립형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-63',
                component: (
               <Button href="/suggest-port/추천_변동성 알고리즘_안정추구형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },

              {
                id: '7-71',
                component: (
               <Button href="/stock-port/테마_그린_배터리" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-72',
                component: (
               <Button href="/stock-port/테마_그린_수소" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-73',
                component: (
               <Button href="/stock-port/테마_그린_수자원" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-74',
                component: (
               <Button href="/stock-port/테마_그린_스마트그리드" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-75',
                component: (
               <Button href="/stock-port/테마_그린_전기차" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-76',
                component: (
               <Button href="/stock-port/테마_그린_중국친환경" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-77',
                component: (
               <Button href="/stock-port/테마_그린_친환경금속" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-78',
                component: (
               <Button href="/stock-port/테마_그린_친환경종합" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-79',
                component: (
               <Button href="/stock-port/테마_그린_태양광" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-710',
                component: (
               <Button href="/stock-port/테마_그린_폐기물" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-711',
                component: (
               <Button href="/stock-port/테마_그린_풍력" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },{
                id: '7-712',
                component: (
               <Button href="/stock-port/테마_그린_원자력" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-81',
                component: (
               <Button href="/stock-port/테마_디지털_5g" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-82',
                component: (
               <Button href="/stock-port/테마_디지털_AI,로보" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-83',
                component: (
               <Button href="/stock-port/테마_디지털_Arg Tech" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-84',
                component: (
               <Button href="/stock-port/테마_디지털_게임" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-85',
                component: (
               <Button href="/stock-port/테마_디지털_반도체" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-86',
                component: (
               <Button href="/stock-port/테마_디지털_블록체인.NET" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-87',
                component: (
               <Button href="/stock-port/테마_디지털_사이버보안" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-88',
                component: (
               <Button href="/stock-port/테마_디지털_원격의료" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },{
                id: '7-89',
                component: (
               <Button href="/stock-port/테마_디지털_인터넷" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-810',
                component: (
               <Button href="/stock-port/테마_디지털_클라우드" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-811',
                component: (
               <Button href="/stock-port/테마_디지털_플랫폼" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-812',
                component: (
               <Button href="/stock-port/테마_디지털_핀테크" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },{
                id: '7-813',
                component: (
               <Button href="/stock-port/테마_디지털_IOT" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-91',
                component: (
               <Button href="/stock-port/테마_바이오_고령화" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-92',
                component: (
               <Button href="/stock-port/테마_바이오_바이오텍" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-93',
                component: (
               <Button href="/stock-port/테마_바이오_의료기기" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-101',
                component: (
               <Button href="/stock-port/테마_인플레이션_금리인상" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-102',
                component: (
               <Button href="/stock-port/테마_인플레이션_달러강세" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-103',
                component: (
               <Button href="/stock-port/테마_인플레이션_원자재" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-104',
                component: (
               <Button href="/stock-port/테마_인플레이션_인프라" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-105',
                component: (
               <Button href="/stock-port/테마_인플레이션_퀄리티고배당" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-106',
                component: (
               <Button href="/stock-port/테마_인플레이션_농업" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-111',
                component: (
               <Button href="/stock-port/테마_기타_대마초" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-112',
                component: (
               <Button href="/stock-port/테마_기타_반려동물" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-113',
                component: (
               <Button href="/stock-port/테마_기타_우주" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-114',
                component: (
               <Button href="/stock-port/테마_기타_자원" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-115',
                component: (
               <Button href="/stock-port/테마_기타_수목" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
               {
                id: '7-121',
                component: (
               <Button href="/stock-port/전략_기업현금흐름_주주환원지수" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
            {
                id: '7-122',
                component: (
               <Button href="/stock-port/전략_기업현금흐름_Capex와 R&D 지수" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-131',
                component: (
               <Button href="/stock-port/전략_인플레이션_인플레이션 수혜기업" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
            {
                id: '7-132',
                component: (
               <Button href="/stock-port/전략_인플레이션_인플레이션 피해기업" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '8-4',
                options: [
                  { value: '1-8-1', label: '적극투자형', trigger: '9-10' },
                  { value: '1-8-2', label: '위험중립형', trigger: '9-11' },
                  { value: '1-8-3', label: '안정추구형', trigger: '9-12' },
                ],
              },
              {
                id: '7-52',
                message: '성향을 선택해주세요',
                trigger: '8-5'
              },
              {
                id: '8-5',
                options: [
                  { value: '1-9-1', label: '적극투자형', trigger: '9-13' },
                  { value: '1-9-2', label: '위험중립형', trigger: '9-14' },
                  { value: '1-9-3', label: '안정추구형', trigger: '9-15' },
                ],
              },
              {
                id: '7-81',
                component: (
               <Button href="/suggest-port/추천_변동성 알고리즘_적극투자형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-82',
                component: (
               <Button href="/suggest-port/추천_변동성 알고리즘_위험중립형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '7-83',
                component: (
               <Button href="/suggest-port/추천_변동성 알고리즘_안정추구형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '9-1',
                component: (
               <Button href="/suggest-port/추천_미래에셋 추천 포트폴리오(국내)_적극투자형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '9-2',
                component: (
               <Button href="/suggest-port/추천_미래에셋 추천 포트폴리오(국내)_위험중립형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '9-3',
                component: (
               <Button href="/suggest-port/추천_미래에셋 추천 포트폴리오(국내)_안정추구형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '9-4',
                component: (
               <Button href="/suggest-port/추천_미래에셋 추천 포트폴리오(해외)_적극투자형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '9-5',
                component: (
               <Button href="/suggest-port/추천_미래에셋 추천 포트폴리오(해외)_위험중립형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '9-6',
                component: (
               <Button href="/suggest-port/추천_미래에셋 추천 포트폴리오(해외)_안정추구형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '9-7',
                component: (
               <Button href="/suggest-port/추천_미래에셋 추천 포트폴리오(연금)_적극투자형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '9-8',
                component: (
               <Button href="/suggest-port/추천_미래에셋 추천 포트폴리오(연금)_위험중립형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '9-9',
                component: (
               <Button href="/suggest-port/추천_미래에셋 추천 포트폴리오(연금)_안정추구형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '9-10',
                component: (
               <Button href="/suggest-port/추천_멀티에셋 모멘텀(국내)_적극투자형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '9-11',
                component: (
               <Button href="/suggest-port/추천_멀티에셋 모멘텀(국내)_위험중립형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '9-12',
                component: (
               <Button href="/suggest-port/추천_멀티에셋 모멘텀(국내)_안정추구형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '9-13',
                component: (
               <Button href="/suggest-port/추천_멀티에셋 모멘텀(해외)_적극투자형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '9-14',
                component: (
               <Button href="/suggest-port/추천_멀티에셋 모멘텀(해외)_위험중립형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '9-15',
                component: (
               <Button href="/suggest-port/추천_멀티에셋 모멘텀(해외)_안정추구형" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
              {
                id: '10',
                component: (
               <Button href="/suggest-port/sample" fullWidth color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
                 결과 페이지로 이동하기
               </Button>
                ),
              },
          ]}
        />
        </ThemeProvider>
          {/*<FlexBox gap={2}>
            <Button fullWidth onClick={() => updateSettings({
            direction: "rtl"
          })} color={settings.direction === "rtl" ? "primary" : "secondary"} variant={settings.direction === "rtl" ? "contained" : "outlined"}>
              RTL
            </Button>

            <Button fullWidth onClick={() => updateSettings({
            direction: "ltr"
          })} color={settings.direction === "ltr" ? "primary" : "secondary"} variant={settings.direction === "ltr" ? "contained" : "outlined"}>
              LTR
            </Button>
          </FlexBox>
          <FlexBox gap={2} flexWrap="wrap">
            {demos.map(demo => <StyledAvatar key={demo.id} src={demo.img} onClick={() => push(demo.path)} />)}
          </FlexBox>*/}

          {/*<Divider sx={{
          my: 3
        }} />

          <H6 textAlign="center" mb={2}>
            AI 상담원이 포트폴리오 구성에 도움을 줄게요!
          </H6>*/}

        </BodyWrapper>
      </MainContainer>
    </ClickAwayListener>;
};
const demos = [{
  id: 0,
  path: "/market-1",
  img: "/assets/images/landing/page-1.png"
}, {
  id: 1,
  path: "/market-2",
  img: "/assets/images/landing/home/market-2.jpg"
}, {
  id: 2,
  path: "/grocery2",
  img: "/assets/images/landing/page-2.png"
}, {
  id: 3,
  path: "/fashion-shop-1",
  img: "/assets/images/landing/page-3.png"
}, {
  id: 4,
  path: "/fashion-shop-2",
  img: "/assets/images/landing/home/fashion-2.jpg"
}, {
  id: 5,
  path: "/fashion-shop-3",
  img: "/assets/images/landing/home/fashion-3.jpg"
}, {
  id: 6,
  path: "/gadget-shop",
  img: "/assets/images/landing/page-4.png"
}, {
  id: 7,
  path: "/furniture-shop",
  img: "/assets/images/landing/furniture.png"
}, {
  id: 8,
  path: "/gift-shop",
  img: "/assets/images/landing/gift-shop.png"
}, {
  id: 9,
  path: "/grocery1",
  img: "/assets/images/landing/grocery1.png"
}, {
  id: 10,
  path: "/grocery3",
  img: "/assets/images/landing/grocery3.png"
}, {
  id: 11,
  path: "/healthbeauty-shop",
  img: "/assets/images/landing/healthbeauty.png"
}];
export default Setting;