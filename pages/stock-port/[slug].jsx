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

  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(0);
  const handleOptionClick = (_, value) => setSelectedOption(value);
  console.log(props.slug)

  // Show a loading state when the fallback is rendered
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }
  return <ShopLayout1>
      <SEO title="Market v1" />
      <Section10 categories={props.bottomCategories} slug={props.slug} title="주식포트폴리오 직접생성\n(다이렉트 인덱싱)" />

      <Setting />
    </ShopLayout1>;
};
export const getStaticPaths = async () => {
  return {
    paths: [],
    //indicates that no page needs be created at build time
    fallback: "blocking" //indicates the type of fallback
  };
};

export const getStaticProps = async ({
  params
}) => {
  const bottomCategories = await api.getCategories();
  const slug = params.slug;
  const mainCarouselData = await api.getMainCarousel();

  return {
    props: {
      slug,
      bottomCategories,
      mainCarouselData,
    }
  };
};
export default ProductDetails;