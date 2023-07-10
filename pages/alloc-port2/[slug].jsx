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
import Section1 from "pages-sections/alloc-port2/Section1";
import Section2 from "pages-sections/alloc-port2/Section2";
import Section3 from "pages-sections/alloc-port2/Section3";
import Section4 from "pages-sections/alloc-port2/Section4";
import Section5 from "pages-sections/alloc-port2/Section5";
import Section6 from "pages-sections/alloc-port2/Section6";
import Section7 from "pages-sections/alloc-port2/Section7";
import Section8 from "pages-sections/alloc-port2/Section8";
import Section10 from "pages-sections/alloc-port2/Section10";
import Section11 from "pages-sections/alloc-port2/Section11";
import Section12 from "pages-sections/alloc-port2/Section12";
import Section13 from "pages-sections/alloc-port2/Section13";
import api from "utils/__api__/market-1";
import ChatBot from 'react-simple-chatbot';


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

      {/* CATEGORIES */}
      <Section10 categories={props.bottomCategories} slug={props.slug} />

      {/* MOBILE PHONES */}
      {/*<Section7 title="전체" shops={props.mobileShops} brands={props.mobileBrands} productList={props.mobileList} />*/}


      {/* HERO SLIDER SECTION */}
      {/*<Section1 carouselData={props.mainCarouselData} />*/}


      {/* SERVICE CARDS */}
       {/*<Section12 serviceList={props.serviceList} />*/}

      {/* POPUP NEWSLETTER FORM */}
      {/* <Newsletter /> */}

      {/* SETTINGS IS USED ONLY FOR DEMO, YOU CAN REMOVE THIS */}
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
  console.log(params.slug);
  const slug = params.slug;
  const bottomCategories = await api.getCategories();
  return {
    props: {
      slug,
      bottomCategories
    }
  };
};
export default ProductDetails;