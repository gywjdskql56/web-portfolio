import { Fragment, useCallback, useState } from "react";
import Sticky from "components/Sticky";
import Topbar from "components/Topbar";
import { Footer1 } from "components/footer";
import Header from "components/header/Header";
import MenuTab from "components/tab/Tab";
import Navbar from "components/navbar/Navbar";
import { MobileNavigationBar } from "components/mobile-navigation";
import SearchInputWithCategory from "components/search-box/SearchInputWithCategory";
import ChatBot from 'react-simple-chatbot';
/**
 *  Used in:
 *  1. market-1, matket-2, gadget-shop,
 *     fashion-shop, fashion-shop-2, fashion-shop-3, furniture-shop, grocery3, gift-shop
 *  2. product details page
 *  3. order-confirmation page
 *  4. product-search page
 *  5. shops and shops-details page
 *  6. checkoutNavLayout and CustomerDashboadLayout component
 */

// ===================================================

// ===================================================

const ShopLayout1 = ({
  children,
  topbarBgColor,
  showTopbar = true,
  showNavbar = true
}) => {
  const [isFixed, setIsFixed] = useState(false);
  const toggleIsFixed = useCallback(fixed => setIsFixed(fixed), []);
  return <Fragment>
      {/* TOPBAR */}
      {/*{showTopbar && <Topbar bgColor={topbarBgColor} />}*/}

      {/* HEADER */}
      <Sticky fixedOn={0} onSticky={toggleIsFixed} scrollDistance={200}>
         <Header isFixed={isFixed} searchInput={<SearchInputWithCategory />} />
      </Sticky>

      {/* TAB */}

      <Sticky fixedOn={0} onSticky={toggleIsFixed} scrollDistance={300}>
        <MenuTab isFixed={isFixed} searchInput={<SearchInputWithCategory />} />
      </Sticky>

      {/*<Sticky fixedOn={100} onSticky={toggleIsFixed} scrollDistance={0} notifyPosition={true}>
         <div>
         <ChatBot
          steps={[
            {
              id: 'hello-world',
              message: 'Hello World!',
              end: false,
            },
          ]}
        />
        </div>
      </Sticky>*/}

      <div className="section-after-sticky">
        {/* NAVIGATION BAR */}
         {/*{showNavbar && <Navbar elevation={0} border={1} />}*/}

        {/* BODY CONTENT */}
        {children}

      </div>




      {/* SMALL DEVICE BOTTOM NAVIGATION */}
      {/*<MobileNavigationBar />*/}

      {/* FOOTER */}
      <Footer1 />
    </Fragment>;
};
export default ShopLayout1;