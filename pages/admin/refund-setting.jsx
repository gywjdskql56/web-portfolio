import { Delete } from "@mui/icons-material";
import { Box, Button, Card, IconButton, TextField } from "@mui/material";
import { FlexBetween, FlexBox } from "components/flex-box";
import AdminDashboardLayout from "components/layouts/admin-dashboard";
import { H3, H4, H5 } from "components/Typography";
import React, { useState } from "react";
const reasonList = [{
  id: 1,
  title: "잘못된 상품을 결제했어요"
}, {
  id: 2,
  title: "판매자가 사실과 다른 상품을 판매했어요"
}, {
  id: 3,
  title: "상품이 품절되거나 조건이 변경되었어요"
}, {
  id: 4,
  title: "예약가능날짜와 일정이 맞지않아요"
}, {
  id: 5,
  title: "다른 상품으로 변경하고 싶어요"
}];

// =============================================================================
RefundSetting.getLayout = function getLayout(page) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
// =============================================================================

export default function RefundSetting() {
  const [refundReq, setRefundReq] = useState("확인중");
  const [refundTime, setRefundTime] = useState("120일");
  const [reasonTypeList, setReasonTypeList] = useState(reasonList);
  const handleDeleteReason = id => () => {
    setReasonTypeList(state => state.filter(item => item.id !== id));
  };
  return <Box py={4}>
      <H3 mb={2}>환불 규정</H3>

      <Card sx={{
      p: 3
    }}>
        <H4 mb={3}>환불 가능 기간</H4>

        <TextField fullWidth color="info" size="medium" value={refundTime} variant="outlined" label="환불 신청 가능 기간" onChange={e => setRefundTime(e.target.value)} sx={{
        fontSize: 14,
        fontWeight: 600,
        mb: 2
      }} />

        <Button color="info" variant="contained">
          저장
        </Button>

        <H4 mb={3} mt={4}>
          주문 상태
        </H4>

        <TextField fullWidth color="info" size="medium" value={refundReq} variant="outlined" label="환불 요청 상태" onChange={e => setRefundReq(e.target.value)} sx={{
        fontSize: 14,
        fontWeight: 600,
        mb: 2
      }} />

        <Button color="info" variant="contained">
          저장
        </Button>

        <H4 mb={3} mt={4}>
          환불 사유
        </H4>
        <H5 mb={2}>환불 사유 유형</H5>

        <Box width={{
        lg: "90%",
        xs: "100%"
      }}>
          {reasonTypeList.map(reason => <FlexBox mb={2} gap={3} key={reason.id} alignItems="center">
              <Box sx={{
            flexGrow: 1,
            fontWeight: 600,
            border: "1px solid",
            borderRadius: "8px",
            padding: "10px 16px",
            borderColor: "grey.300"
          }}>
                {reason.title}
              </Box>

              <IconButton onClick={handleDeleteReason(reason.id)} sx={{
            backgroundColor: "grey.200"
          }}>
                <Delete sx={{
              fontSize: 19,
              color: "grey.600"
            }} />
              </IconButton>
            </FlexBox>)}

          <FlexBetween mt={4}>
            <Button color="info" variant="contained">
              저장
            </Button>

            <Button color="info" variant="outlined">
              추가하기
            </Button>
          </FlexBetween>
        </Box>
      </Card>
    </Box>;
}