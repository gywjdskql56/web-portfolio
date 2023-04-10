import { useState } from "react";
import { useRouter } from "next/router";
import { Box, Container, styled, Tab, Tabs } from "@mui/material";
import { H2 } from "components/Typography";
import ShopLayout1 from "components/layouts/ShopLayout1";
import ProductIntro from "components/products/ProductIntro";
import ProductReview from "components/products/ProductReview";
import AvailableShops from "components/products/AvailableShops";
import RelatedProducts from "components/products/RelatedProducts";
import FrequentlyBought from "components/products/FrequentlyBought";
import ProductDescription from "components/products/ProductDescription";
import { getFrequentlyBought, getRelatedProducts } from "utils/__api__/related-products";
import SEO from "components/SEO";
import Setting from "components/Setting";
// import Newsletter from "components/Newsletter";
import Section1 from "pages-sections/home/Section1";
import Section2 from "pages-sections/home/Section2";
import Section3 from "pages-sections/home/Section3";
import Section4 from "pages-sections/home/Section4";
import Section5 from "pages-sections/home/Section5";
import Section6 from "pages-sections/home/Section6";
import Section7 from "pages-sections/home/Section7";
import Section8 from "pages-sections/home/Section8";
import Section10 from "pages-sections/home/Section10";
import Section11 from "pages-sections/home/Section11";
import Section12 from "pages-sections/home/Section12";
import Section13 from "pages-sections/home/Section13";
import api from "utils/__api__/market-1";
import ChatBot from 'react-simple-chatbot';
// styled component
const StyledTabs = styled(Tabs)(({
  theme
}) => ({
  minHeight: 0,
  marginTop: 80,
  marginBottom: 24,
  borderBottom: `1px solid ${theme.palette.text.disabled}`,
  "& .inner-tab": {
    minHeight: 40,
    fontWeight: 600,
    textTransform: "capitalize"
  }
}));

// ===============================================================

// ===============================================================

const ProductDetails = props => {
//  const {
//    slug
//  } = props;
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(0);
  const handleOptionClick = (_, value) => setSelectedOption(value);
  console.log(props)

  // Show a loading state when the fallback is rendered
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }
  return <ShopLayout1>
      <SEO title="Market v1" />


      {/* CATEGORIES */}
      {/*<Section10 categories={props.bottomCategories} />*/}

      {/* MOBILE PHONES */}
      {/*<Section7 title="전체" shops={props.mobileShops} brands={props.mobileBrands} productList={props.mobileList} />*/}


      {/* HERO SLIDER SECTION */}
      <Section1 carouselData={props.mainCarouselData} />

      {/* FLASH DEALS SECTION */}
      {/*<Section2 flashDeals={props.flashDealsData} />*/}

      {/* TOP CATEGORIES */}
      {/*<Section3 categoryList={props.topCategories} />*/}

      {/* TOP RATED PRODUCTS */}
      {/*<Section4 topRatedList={props.topRatedProducts} topRatedBrands={props.topRatedBrands} />*/}

      {/* NEW ARRIVAL LIST */}
{/*       <Section5 newArrivalsList={props.newArrivalsList} /> */}

      {/* BIG DISCOUNTS */}
{/*       <Section13 bigDiscountList={props.bigDiscountList} /> */}

      {/* CAR LIST */}
{/*       <Section6 carBrands={props.carBrands} carList={props.carList} /> */}

      {/* PROMO BANNERS */}
{/*       <Section8 /> */}

      {/* OPTICS / WATHCH */}
{/*       <Section7 title="Optics / Watch" shops={props.opticsShops} brands={props.opticsBrands} productList={props.opticsList} /> */}

      {/* MORE FOR YOU */}
{/*       <Section11 moreItems={props.moreItems} /> */}

      {/* SERVICE CARDS */}
      <Section12 serviceList={props.serviceList} />

      {/* POPUP NEWSLETTER FORM */}
{/*       <Newsletter /> */}

      {/* SETTINGS IS USED ONLY FOR DEMO, YOU CAN REMOVE THIS */}
      <Setting />
    </ShopLayout1>;
};
export const getStaticPaths = async () => {
//  const paths = await api.getSlugs();
  return {
    paths: [],
    //indicates that no page needs be created at build time
    fallback: "blocking" //indicates the type of fallback
  };
};

export const getStaticProps = async ({
  params
}) => {
  console.log(params.slug);
  const slug = params.slug;
  const serviceList = await api.getServiceList();
  const mainCarouselData = await api.getMainCarousel();
  return {
    props: {
      slug,
      serviceList,
      mainCarouselData,
    }
  };
};

export default ProductDetails;