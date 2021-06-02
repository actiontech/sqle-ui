const CracoLessPlugin = require('craco-less');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new MonacoWebpackPlugin({
          languages: ['sql'],
          features: ['smartSelect'],
        }),
      ],
    },
  },
  jest: {
    configure: {
      collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/api/**/*.{ts,tsx}',
        '!src/**/*.d.{ts,tsx}',
        '!src/**/*.type.{ts,tsx}',
        '!src/locale/**/*.{ts,tsx}',
        '!src/testUtils/**/*.{ts,tsx}',
        '!src/data/**/*.{ts,tsx}',
        '!src/reportWebVitals.ts',
      ],
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
