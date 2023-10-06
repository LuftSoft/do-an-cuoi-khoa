/** @type {import('next').NextConfig} */
module.exports = {
  devIndicators: {},
  publicRuntimeConfig: {
    theme: 'DEFAULT',
    currency: 'USD',
  },
  /**
   * @param {import('webpack').Configuration} config
   * @returns {import('webpack').Configuration}
   */
  webpack: (config) => {
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();

      // entries['main.js'] is the starting point of the project
      if (
        entries['main.js'] &&
        !entries['main.js'].includes('./src/polyfills.ts')
      ) {
        entries['main.js'].unshift('./src/polyfills.ts');
      }

      return entries;
    };

    return config;
  },
};
