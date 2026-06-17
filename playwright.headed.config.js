import baseConfig from './playwright.config.js';

export default {
  ...baseConfig,
  use: {
    ...baseConfig.use,
    headless: false,
    launchOptions: {
      ...baseConfig.use.launchOptions,
      slowMo: 750,
    },
  },
};
