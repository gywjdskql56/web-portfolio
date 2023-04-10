import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SEO from "components/SEO";
import Setting from "components/Setting";
// import Newsletter from "components/Newsletter";
import ShopLayout1 from "components/layouts/ShopLayout1";
import Section1 from "pages-sections/stock-port/Section1";
import Section2 from "pages-sections/stock-port/Section2";
import Section3 from "pages-sections/stock-port/Section3";
import Section4 from "pages-sections/stock-port/Section4";
import Section5 from "pages-sections/stock-port/Section5";
import Section6 from "pages-sections/stock-port/Section6";
import Section7 from "pages-sections/stock-port/Section7";
import Section8 from "pages-sections/stock-port/Section8";
import Section10 from "pages-sections/stock-port/Section10";
import Section11 from "pages-sections/stock-port/Section11";
import Section12 from "pages-sections/stock-port/Section12";
import Section13 from "pages-sections/stock-port/Section13";
import api from "utils/__api__/market-1";
// =================================================================

const MarketShop = props => {
  return <ShopLayout1>
      <SEO title="Market v1" />

      {/* CATEGORIES */}
      <Section10 categories={props.bottomCategories} slug={props.slug} title="주식포트폴리오 직접생성\n(다이렉트 인덱싱)" />

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
  const slug="테마_그린_배터리";
  return {
    props: {
      bottomCategories,
      slug
    }
  };
};
export default MarketShop;