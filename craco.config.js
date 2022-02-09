const CracoLessPlugin = require('craco-less');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const { getLoaders, loaderByName } = require('@craco/craco');

process.env.isEE =
  process.argv.includes('--ee') || process.env.NODE_ENV === 'test';

console.log(`current mode: ${process.env.isEE === 'true' ? 'ee' : 'ce'}`);

module.exports = {
  webpack: {
    plugins: {
      add: [
        new MonacoWebpackPlugin({
          languages: ['sql'],
          features: ['smartSelect', 'suggest'],
        }),
      ],
    },
    configure: (config) => {
      const babelLoaders = getLoaders(config, loaderByName('babel-loader'));
      if (babelLoaders.hasFoundAny) {
        babelLoaders.matches.forEach((item) => {
          if (item.loader.test.test('aaa.tsx')) {
            const { loader, options } = item.loader;
            delete item.loader.loader;
            delete item.loader.options;
            item.loader.use = [
              {
                loader,
                options,
              },
              {
                loader: 'js-conditional-compile-loader',
                options: {
                  isEE: process.env.isEE === 'true',
                },
              },
            ];
          }
        });
      }
      return config;
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
      ...(function () {
        const url = [
          '/v1/users',
          '/v1/user_group_tips',
          '/v2/roles',
          '/v1/operations',
        ];
        return url.reduce((acc, cur) => {
          acc[cur] = {
            target: 'http://localhost:4200',
            secure: false,
            changeOrigin: true,
            ws: true,
            xfwd: true,
          };
          return acc;
        }, {});
      })(),
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
