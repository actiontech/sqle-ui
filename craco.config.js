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
      moduleNameMapper: {
        'monaco-editor': '<rootDir>/node_modules/react-monaco-editor',
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
};
