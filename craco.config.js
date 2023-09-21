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
                  isCE: process.env.isEE !== 'true',
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
        '!src/reportWebVitals.ts',
        '!src/index.tsx',
        '!src/router/config.tsx',
        '!src/components/BackendForm/index.ts',
        '!src/components/EditText/index.ts',
        '!src/hooks/useOperation/index.tsx',
        '!src/page/AuditPlan/PlanForm/AuditTaskType/index.tsx',
        '!src/page/ProjectManage/ProjectOverview/Chats/CommonGauge/registerShape.ts',
        '!src/hooks/useMonacoEditor/regexLanguage.ts',
      ],
      moduleNameMapper: {
        'react-monaco-editor': '<rootDir>/src/testUtils/mockEditor.jsx',
        '@ant-design/plots': '<rootDir>/src/testUtils/mockAntDesignPlots.jsx',
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
        const url = ['/static/media'];
        return url.reduce((acc, cur) => {
          acc[cur] = {
            target: 'http://124.70.158.246:8889',
            secure: false,
            changeOrigin: true,
            ws: true,
            xfwd: true,
          };
          return acc;
        }, {});
      })(),
      ...(function () {
        const res = {};
        for (let i = 0; i < 10; i++) {
          res[`/v${i}`] = {
            target: 'http://192.168.22.81:10000',
            secure: false,
            changeOrigin: true,
            ws: true,
            xfwd: true,
          };
        }
        return res;
      })(),
    };
    return config;
  },
};
