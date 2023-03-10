import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SEO from "components/SEO";
import Setting from "components/Setting";
// import Newsletter from "components/Newsletter";
import ShopLayout1 from "components/layouts/ShopLayout1";
import api from "utils/__api__/market-1";
// =================================================================
import React, { useState } from "react";
import Json from "../hedgeFollow_popular_hedge_fund.json";
import Json_2 from "../hedgeFollow_top50.json";
import styled from "styled-components";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);
import { Doughnut } from "react-chartjs-2";

const MarketShop = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState("");
  const [ticker, setTicker] = useState([]);
  const [initialWeight, setInitialWeight] = useState([]);
  const [index, setIndex] = useState(0);
  let pieColumns = [];
  let pieList = [];
  // 모달창 노출
  const showModal = (name) => {
    setModalOpen(true);
    setModal(name);
    let sum = 0.0;
    for (let i = 0; i < Json_2[name].length; i++) {
      if (i < 10) {
        pieColumns.push(Json_2[name][i]["Company Name"]);
        pieList.push(parseFloat(Json_2[name][i]["% of Portfolio"]).toFixed(1));
      } else if (i >= 10) {
        sum += Number(parseFloat(Json_2[name][i]["% of Portfolio"]).toFixed(1));
        console.log(sum);
      }
    }
    if (sum > 0) {
      pieColumns.push("Others");
      pieList.push(sum);
    }

    setTicker(pieColumns);
    setInitialWeight(pieList);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const columns = [
    "Fund Manager",
    "Hedge Fund",
    "3-Year Performance",
    "Ann. 3Y Return",
    "AUM",
    "Turnover",
    "Score",
  ];
  // const columns_2 = ['undefined', 'Stock', 'Company Name', '% of Portfolio', 'Shares Owned', 'Value', 'Change in Shares', 'Ownership History', 'Average Buy Price', 'Price History', 'Date'];
  const columns_2 = [
    "Stock",
    "Company Name",
    "% of Portfolio",
    "Shares Owned",
    "Value",
    "Change in Shares",
    "Average Buy Price",
    "Date",
  ];

  const expData = {
    labels: ticker,
    datasets: [
      {
        labels: ticker,
        data: initialWeight,
        borderWidth: 2,
        hoverBorderWidth: 3,
        backgroundColor: [
          "#99FFFF",
          "#F0FF9E",
          "#DFC7FF",
          "#8FFFE5",
          "#EB8AFF",
          "#FFAED3",
          "#A3A92FF",
        ],
        fill: false,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "right",
        align: "right",
        labels: {
          boxWidth: 12,
          padding: 5,
          textAlign: "right",
        },
      },
    },
  };

  return (
    <ShopLayout1>
      <SEO title="Market v1" />
      <Setting />
      <TextDiv className="TextDiv">
        <div className="Wrap">
          <div className="Title">Top 10 Most Popular Hedge Funds</div>
          <div className="Description">
            This list shows the 10 most popular hedge funds based on their annualized
            3-year return, using a weighted portfolio of their top 50 holdings
            over this period. It shows the change in number of shares for the last quarter. 
          </div>
          {modalOpen && (
            <Modal className="Modal" onClick={closeModal}>
              <div className="Container">
                <TableSection className="TableSection">
                  <div className="AlgorithmTableDiv">
                    <table>
                      <thead>
                        <tr>
                          {columns.map((col, index) => {
                            return <th key={index}>{col}</th>;
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {Json.Sheet1.map((row, rowIndex) => {
                          if (rowIndex === index) {
                            return (
                              <tr>
                                <td>{row["Fund Manager"]}</td>
                                <td>{row["Hedge Fund"]}</td>
                                {parseFloat(row["3-Year Performance"]) > 0 ? (
                                  <td className="Green">
                                    {row["3-Year Performance"]}
                                  </td>
                                ) : parseFloat(row["3-Year Performance"]) <
                                  0 ? (
                                  <td className="Red">
                                    {row["3-Year Performance"]}
                                  </td>
                                ) : (
                                  <td>{row["3-Year Performance"]}</td>
                                )}
                                {parseFloat(row["Ann. 3Y Return"]) > 0 ? (
                                  <td className="Green">
                                    {row["Ann. 3Y Return"]}
                                  </td>
                                ) : parseFloat(row["Ann. 3Y Return"]) < 0 ? (
                                  <td className="Red">
                                    {row["Ann. 3Y Return"]}
                                  </td>
                                ) : (
                                  <td>{row["Ann. 3Y Return"]}</td>
                                )}
                                <td>{row["AUM"]}</td>
                                <td>{row["Turnover"]}</td>
                                <td>{row["Score"]}</td>
                              </tr>
                            );
                          }
                        })}
                      </tbody>
                    </table>
                  </div>
                </TableSection>
                <div className="Doughnut">
                  <Doughnut options={options} data={expData} />
                </div>
                <div className="Description">Top 50 Holdings</div>
                <TableSection className="TableSection">
                  <div className="AlgorithmTableDiv">
                    <table>
                      <thead>
                        <tr>
                          {columns_2.map((col, index) => {
                            return <th key={index}>{col}</th>;
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {Json_2[modal].map((row, rowIndex) => {
                          return (
                            <tr>
                              <td>{row["Stock"]}</td>
                              <td>{row["Company Name"]}</td>
                              <td>
                                {parseFloat(row["% of Portfolio"]).toFixed(1)}
                              </td>
                              <td>{row["Shares Owned"]}</td>
                              <td>{row["Value"]}</td>
                              {parseFloat(row["Change in Shares"]) > 0 ? (
                                <td className="Green">
                                  {row["Change in Shares"]}
                                </td>
                              ) : parseFloat(row["Change in Shares"]) < 0 ? (
                                <td className="Red">
                                  {row["Change in Shares"]}
                                </td>
                              ) : (
                                <td>{row["Change in Shares"]}</td>
                              )}
                              {/* <td>{row['Ownership History']}</td> */}
                              <td>{row["Average Buy Price"]}</td>
                              {/* <td>{row['Price History']}</td> */}
                              <td>{row["Date"]}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </TableSection>
              </div>
            </Modal>
          )}
          <div className="Flex">
            <TableSection className="TableSection">
              <div className="AlgorithmTableDiv">
                <table>
                  <thead>
                    <tr>
                      {columns.map((col, index) => {
                        return <th key={index}>{col}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {Json.Sheet1.map((row, rowIndex) => {
                      return (
                        <tr
                          onClick={(e) =>
                            showModal(row["Fund Manager"], rowIndex)
                          }
                        >
                          <td>{row["Fund Manager"]}</td>
                          <td>{row["Hedge Fund"]}</td>
                          {parseFloat(row["3-Year Performance"]) > 0 ? (
                            <td className="Green">
                              {row["3-Year Performance"]}
                            </td>
                          ) : parseFloat(row["3-Year Performance"]) < 0 ? (
                            <td className="Red">{row["3-Year Performance"]}</td>
                          ) : (
                            <td>{row["3-Year Performance"]}</td>
                          )}
                          {parseFloat(row["Ann. 3Y Return"]) > 0 ? (
                            <td className="Green">{row["Ann. 3Y Return"]}</td>
                          ) : parseFloat(row["Ann. 3Y Return"]) < 0 ? (
                            <td className="Red">{row["Ann. 3Y Return"]}</td>
                          ) : (
                            <td>{row["Ann. 3Y Return"]}</td>
                          )}
                          <td>{row["AUM"]}</td>
                          <td>{row["Turnover"]}</td>
                          <td>{row["Score"]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TableSection>
          </div>
        </div>
      </TextDiv>
    </ShopLayout1>
  );
};
const Modal = styled.div`
  z-index: 1500;
  display: block;
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .AlgorithmTableDiv {
    border-radius: 0px !important;
  }
  .Doughnut {
    width: 500px;
    padding: 10px;
    margin: 0 auto;
  }
  .Container {
    /* 모달창 크기 */
    width: 1240px;
    height: 800px;
    margin: 100px auto;

    /* 최상단 위치 */
    z-index: 999;
    overflow-y: scroll;

    /* 중앙 배치 */
    /* top, bottom, left, right 는 브라우저 기준으로 작동한다. */
    /* translate는 본인의 크기 기준으로 작동한다. */
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);

    /* 모달창 디자인 */
    background-color: white;
    -ms-overflow-style: none; // IE에서 스크롤바 감춤
    &::-webkit-scrollbar {
      display: none !important; // 윈도우 크롬 등
    }
  }

  /* 모달창 내부 X버튼 */
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
  }
`;
const TextDiv = styled.div`
  .Title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 40px;
    margin-left: 10px;
  }
  .Description {
    font-size: 20px;
    margin-bottom: 20px;
    margin-left: 10px;
  }
  .Wrap {
    display: flex;
    flex-direction: column;
    max-width: 1240px;
    margin: 100px auto;
    margin-top: 100px;
  }
`;
const TableSection = styled.section`
  margin-bottom: 100px;
  .DateButton {
    padding: 10px;
    border: 1px solid #dedede;
    border-radius: 10px;
    margin-bottom: 5px;
    margin-right: 5px;
    font-weight: bold;
  }
  .DateActive {
    background: #043b72;
    color: #fff;
  }
  .AlgorithmTableDiv {
    border: 1px solid #dedede;
    border-radius: 10px;
  }
  table {
    border-collapse: separate;
    width: 100%;
    border-spacing: 5px;
  }
  td,
  th {
    padding: 5px;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    text-align: center;
  }
  tr:nth-child(even) {
    background-color: #f5f5f5;
  }
  tr:hover {
    background-color: #ddd;
  }
  th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: white;
    border: none;
    color: #868686;
    font-weight: bold;
    text-align: center;
  }
  .Green {
    color: #1ca41c;
  }
  .Red {
    color: #e31a1c;
  }
`;

export const getStaticProps = async ({ locale }) => {
  const carList = await api.getCarList();
  const carBrands = await api.getCarBrands();
  const moreItems = await api.getMoreItems();
  const mobileList = await api.getMobileList();
  const opticsList = await api.getOpticsList();
  const mobileShops = await api.getMobileShops();
  const opticsShops = await api.getOpticsShops();
  const serviceList = await api.getServiceList();
  const mobileBrands = await api.getMobileBrands();
  const flashDealsData = await api.getFlashDeals();
  const opticsBrands = await api.getOpticsBrands();
  const bottomCategories = await api.getCategories();
  const topCategories = await api.getTopCategories();
  const topRatedBrands = await api.getTopRatedBrand();
  const mainCarouselData = await api.getMainCarousel();
  const newArrivalsList = await api.getNewArrivalList();
  const bigDiscountList = await api.getBigDiscountList();
  const topRatedProducts = await api.getTopRatedProduct();
  let locales = await serverSideTranslations(locale ?? "en", ["common"]);
  return {
    props: {
      ...locales,
      carList,
      carBrands,
      moreItems,
      mobileList,
      opticsList,
      serviceList,
      mobileShops,
      opticsShops,
      mobileBrands,
      opticsBrands,
      topCategories,
      flashDealsData,
      topRatedBrands,
      newArrivalsList,
      bigDiscountList,
      mainCarouselData,
      topRatedProducts,
      bottomCategories,
    },
  };
};
export default MarketShop;
