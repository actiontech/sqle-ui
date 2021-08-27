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
        '!src/page/Login/LoginBackground/**/*.{ts,tsx}',
        '!src/reportWebVitals.ts',
        '!src/index.tsx',
        '!src/router/config.tsx',
      ],
      moduleNameMapper: {
        'react-monaco-editor': '<rootDir>/src/testUtils/mockEditor.jsx',
      },
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
  devServer: (config, { proxy }) => {
    config.proxy = {
      '/v1/audit_': {
        target: 'http://localhost:4200',
        secure: false,
        changeOrigin: true,
        ws: true,
        xfwd: true,
      },
      '/v1': {
        target: 'http://10.186.62.5:10000',
        secure: false,
        changeOrigin: true,
        ws: true,
        xfwd: true,
      },
    };
    return config;
  },
};
