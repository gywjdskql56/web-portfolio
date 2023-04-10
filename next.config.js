const { i18n } = require("./next-i18next.config");

module.exports = {
  i18n,
  devIndicators: {},
  publicRuntimeConfig: {
    // Available on both server and client
    theme: "DEFAULT",
    currency: "USD",
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  staticPageGenerationTimeout: 1000,
  reactStrictMode: false,

};
