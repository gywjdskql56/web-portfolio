import categoriesMegaMenu from "./categoriesMegaMenu";

// MEGAMENU DATA
const megaMenus = [[{
  title: "홈",
  child: [{
    title: "Market 1",
    url: "/market-1"
  }, {
    title: "Furniture",
    url: "/furniture-shop"
  }, {
    title: "Grocery-v1",
    url: "/grocery1"
  }, {
    title: "Grocery-v2",
    url: "/grocery2"
  }, {
    title: "Grocery-v3",
    url: "/grocery3"
  }, {
    title: "Health and Beauty",
    url: "/healthbeauty-shop"
  }, {
    title: "Fashion",
    url: "/fashion-shop-1"
  }, {
    title: "Gift Store",
    url: "/gift-shop"
  }, {
    title: "Gadget",
    url: "/gadget-shop"
  }]
}], [{
  title: "마이 페이지",
  child: [{
    title: "Order List",
    url: "/orders"
  }, {
    title: "주문 상세",
    url: "/orders/f0ba538b-c8f3-45ce-b6c1-209cf07ba5f8"
  }, {
    title: "View Profile",
    url: "/profile"
  }, {
    title: "Edit Profile",
    url: "/profile/e42e28ea-528f-4bc8-81fb-97f658d67d75"
  }, {
    title: "Address List",
    url: "/address"
  }, {
    title: "Add Address",
    url: "/address/d27d0e28-c35e-4085-af1e-f9f1b1bd9c34"
  }, {
    title: "All tickets",
    url: "/support-tickets"
  }, {
    title: "Ticket details",
    url: "/support-tickets/when-will-my-product-arrive"
  }, {
    title: "Wishlist",
    url: "/wish-list"
  }]
}], [{
  title: "판매사 페이지",
  child: [{
    title: "Dashboard",
    url: "/vendor/dashboard"
  }, {
    title: "Profile",
    url: "/vendor/account-setting"
  }]
}, {
  title: "Products",
  child: [{
    title: "All products",
    url: "/admin/products"
  }, {
    title: "Add/Edit product",
    url: "/admin/products/create"
  }]
}, {
  title: "Orders",
  child: [{
    title: "All orders",
    url: "/admin/orders"
  }, {
    title: "Order details",
    url: "/admin/orders/f0ba538b-c8f3-45ce-b6c1-209cf07ba5f8"
  }]
}], [{
  title: "이벤트/할인",
  child: [{
    title: "Sales Version 1",
    url: "/sale-page-1"
  }, {
    title: "Sales Version 2",
    url: "/sale-page-2"
  }]
}, {
  title: "주문/예약",
  child: [{
    title: "Search product",
    url: "/product/search/mobile phone"
  }, {
    title: "Single product",
    url: "/product/lord-2019"
  }, {
    title: "Cart",
    url: "/cart"
  }, {
    title: "Checkout",
    url: "/checkout"
  }, {
    title: "Alternative Checkout",
    url: "/checkout-alternative"
  }, {
    title: "Order confirmation",
    url: "/order-confirmation"
  }]
}]];

// MAIN NAVIGATION DATA
const navbarNavigations = [{
  title: "Home",
  megaMenu: false,
  megaMenuWithSub: false,
  child: [{
    title: "Market 1",
    url: "/market-1"
  }, {
    title: "Market 2",
    url: "/market-2"
  }, {
    title: "Furniture",
    url: "/furniture-shop"
  }, {
    title: "Grocery 1",
    url: "/grocery1"
  }, {
    title: "Grocery 2",
    url: "/grocery2"
  }, {
    title: "Grocery 3",
    url: "/grocery3"
  }, {
    title: "Health and Beauty",
    url: "/healthbeauty-shop"
  }, {
    title: "Fashion 1",
    url: "/fashion-shop-1"
  }, {
    title: "Fashion 2",
    url: "/fashion-shop-2"
  }, {
    title: "Fashion 3",
    url: "/fashion-shop-3"
  }, {
    title: "Gift Store",
    url: "/gift-shop"
  }, {
    title: "Gadget",
    url: "/gadget-shop"
  }]
}, {
  megaMenu: true,
  megaMenuWithSub: false,
  title: "Mega Menu",
  child: megaMenus
}, {
  megaMenu: false,
  megaMenuWithSub: true,
  title: "Full Screen Menu",
  child: categoriesMegaMenu
}, {
  megaMenu: false,
  megaMenuWithSub: false,
  title: "Pages",
  child: [{
    title: "Sale Page",
    child: [{
      title: "Version 1",
      url: "/sale-page-1"
    }, {
      title: "Version 2",
      url: "/sale-page-2"
    }]
  }, {
    title: "판매사",
    child: [{
      title: "All vendors",
      url: "/shops"
    }, {
      title: "Vendor store",
      url: "/shops/scarlett-beauty"
    }]
  }, {
    title: "상점",
    child: [{
      title: "Search product",
      url: "/product/search/mobile phone"
    }, {
      title: "Single product",
      url: "/product/lord-2019"
    }, {
      title: "Cart",
      url: "/cart"
    }, {
      title: "Checkout",
      url: "/checkout"
    }, {
      title: "Alternative Checkout",
      url: "/checkout-alternative"
    }, {
      title: "Order confirmation",
      url: "/order-confirmation"
    }]
  }]
}, {
  megaMenu: false,
  megaMenuWithSub: false,
  title: "User Account",
  child: [{
    title: "Orders",
    child: [{
      title: "Order List",
      url: "/orders"
    }, {
      title: "주문 상세",
      url: "/orders/f0ba538b-c8f3-45ce-b6c1-209cf07ba5f8"
    }]
  }, {
    title: "Profile",
    child: [{
      title: "View Profile",
      url: "/profile"
    }, {
      title: "Edit Profile",
      url: "/profile/e42e28ea-528f-4bc8-81fb-97f658d67d75"
    }]
  }, {
    title: "Address",
    child: [{
      title: "Address List",
      url: "/address"
    }, {
      title: "Add Address",
      url: "/address/d27d0e28-c35e-4085-af1e-f9f1b1bd9c34"
    }]
  }, {
    title: "Support tickets",
    child: [{
      title: "All tickets",
      url: "/support-tickets"
    }, {
      title: "Ticket details",
      url: "/support-tickets/when-will-my-product-arrive"
    }]
  }, {
    title: "Wishlist",
    url: "/wish-list"
  }]
}, {
  megaMenu: false,
  megaMenuWithSub: false,
  title: "판매사 계정",
  child: [{
    title: "Dashboard",
    url: "/vendor/dashboard"
  }, {
    title: "Products",
    child: [{
      title: "All products",
      url: "/admin/products"
    }, {
      title: "Add/Edit product",
      url: "/admin/products/lord-2019"
    }]
  }, {
    title: "주문",
    child: [{
      title: "모든 주문",
      url: "/admin/orders"
    }, {
      title: "주문 상세",
      url: "/admin/orders/f0ba538b-c8f3-45ce-b6c1-209cf07ba5f8"
    }]
  }, {
    title: "프로필",
    url: "/vendor/account-setting"
  }]
}];
export default navbarNavigations;