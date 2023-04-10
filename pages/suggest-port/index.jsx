
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SEO from "components/SEO";
import Setting from "components/Setting";
// import Newsletter from "components/Newsletter";
import ShopLayout1 from "components/layouts/ShopLayout1";
import Section1 from "pages-sections/suggest-port/Section1";
import Section2 from "pages-sections/suggest-port/Section2";
import Section3 from "pages-sections/suggest-port/Section3";
import Section4 from "pages-sections/suggest-port/Section4";
import Section5 from "pages-sections/suggest-port/Section5";
import Section6 from "pages-sections/suggest-port/Section6";
import Section7 from "pages-sections/suggest-port/Section7";
import Section8 from "pages-sections/suggest-port/Section8";
import Section10 from "pages-sections/suggest-port/Section10";
import Section11 from "pages-sections/suggest-port/Section11";
import Section12 from "pages-sections/suggest-port/Section12";
import Section13 from "pages-sections/suggest-port/Section13";
import queryString from "query-string";
import api from "utils/__api__/market-1";
import { useLocation, useParams } from 'react-router';
import QueryString from 'qs';
// =================================================================

const MarketShop = props => {
//    const location=useLocation();

  return <ShopLayout1>
      <SEO title="Market v1" />

      {/* CATEGORIES */}
      <Section10 categories={props.bottomCategories} slug={props.slug} />

      {/* MOBILE PHONES */}
      {/*<Section7 title="전체" shops={props.mobileShops} brands={props.mobileBrands} productList={props.mobileList} />*/}


      {/* HERO SLIDER SECTION */}
      {/*<Section1 carouselData={props.mainCarouselData} />*/}


      {/* SERVICE CARDS */}
       {/*<Section12 serviceList={props.serviceList} />*/}

      {/* POPUP NEWSLETTER FORM */}
{/*       <Newsletter /> */}

      {/* SETTINGS IS USED ONLY FOR DEMO, YOU CAN REMOVE THIS */}
      <Setting />
    </ShopLayout1>;
};
export const getStaticProps = async () => {

  const bottomCategories = await api.getCategories();
  const slug = "추천_미래에셋 추천 포트폴리오(국내)_적극투자형"
  return {
    props: {
      bottomCategories,
      slug
    }
  };
};
export default MarketShop;