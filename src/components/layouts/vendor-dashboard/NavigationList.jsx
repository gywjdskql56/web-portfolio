import duotone from "components/icons/duotone";
export const navigations = [{
  type: "label",
  label: "판매사"
}, {
  name: "현황표",
  icon: duotone.Dashboard,
  path: "/vendor/dashboard"
},{
  name: "매출",
  icon: duotone.ProjectChart,
  children: [{
    name: "매출 내역",
    path: "/vendor/earning-history"
  }, {
    name: "대금결제",
    path: "/vendor/payouts"
  }, {
    name: "대금결제 요청",
    path: "/vendor/payout-requests"
  }, {
    name: "대금결제 설정",
    path: "/vendor/payout-settings"
  }]
}, {
  name: "환불 요청",
  icon: duotone.Refund,
  path: "/vendor/refund-request"
}, {
  name: "리뷰",
  icon: duotone.Review,
  path: "/vendor/reviews"
}, {
  name: "판매사 세팅",
  icon: duotone.SiteSetting,
  path: "/vendor/shop-settings"
}, {
  name: "고객센터 관리",
  icon: duotone.ElementHub,
  path: "/vendor/support-tickets"
}, {
  name: "계정 관리",
  icon: duotone.AccountSetting,
  path: "/vendor/account-setting"
},
//{
//  name: "사이트 관리",
//  icon: duotone.SiteSetting,
//  path: "/vendor/site-settings"
//},
{
  name: "로그아웃",
  icon: duotone.Session,
  path: "/"
}];