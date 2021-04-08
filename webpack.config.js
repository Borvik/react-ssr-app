const path = require('path');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');
const LoadablePlugin = require('@loadable/webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require('webpack');

module.exports = (env) => {
  const isDevelopment = env.NODE_ENV !== 'production';
  const DIST_PATH = path.resolve(__dirname, 'dist');
  const PUBLIC_PATH = path.resolve(__dirname, 'public');

  console.log('Running BUILD in:', isDevelopment ? 'development' : 'production');
  const getConfig = (target) => ({
    name: target,
    mode: isDevelopment ? 'development' : 'production',
    target,
    context: __dirname,
    entry: {
      main: isDevelopment && target !== 'node'
        ? [`webpack-hot-middleware/client?name=${target}&path=/__webpack_hmr`, `./src/index-${target}.tsx`]
        : [`./src/index-${target}.tsx`],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      plugins: [
        new TsconfigPathsPlugin(),
      ],
    },
    externals: target === 'node'
      ? ['@loadable/component', nodeExternals()]
      : undefined,
    module: {
      rules: [
        {
          test: /\.m?js$/,
          enforce: 'pre',
          use: ['source-map-loader']
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                caller: { target },
                presets: [
                  '@babel/react',
                ],
                plugins: [
                  '@babel/plugin-syntax-dynamic-import',
                  '@loadable/babel-plugin',
                  isDevelopment && 'react-refresh/babel',
                ].filter(Boolean)
              },
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              }
            }
          ],
        },
        {
          test: /\.s?css$/,
          use: target === 'node'
            ? [ 'null-loader' ]
            : [
                isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: true,
                    modules: false,
                  },
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: true,
                    implementation: require('sass'),
                    sassOptions: (loaderContext) => {
                      const { rootContext } = loaderContext;
                      const modulesPath = path.join(rootContext, 'node_modules');
                      return {
                        includePaths: [ modulesPath ]
                      };
                    }
                  }
                }
              ]
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack', 'url-loader'],
        }
      ],
    },
    optimization: {
      moduleIds: 'named',
      chunkIds: 'named',
    },
    output: {
      path: path.resolve(DIST_PATH, target),
      filename: isDevelopment ? '[name].js' : '[name]-bundle-[chunkhash:8].js',
      publicPath: target === 'web' ? `/` : undefined,
      libraryTarget: target === 'node' ? 'commonjs2' : undefined,
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `main.[contenthash].css`,
        chunkFilename: `[name].[contenthash].css`,
      }),
      new LoadablePlugin(),
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
      isDevelopment && new ReactRefreshPlugin({
        overlay: {
          sockIntegration: 'whm',
        },
      }),
      (target === 'web') && new CopyPlugin({
        patterns: [
          {
            from: PUBLIC_PATH,
            to: path.resolve(DIST_PATH, target),
            globOptions: {
              ignore: [
                '**/index.html'
              ]
            }
          },
        ],
      }),
      new ForkTsCheckerWebpackPlugin(),
    ].filter(Boolean),
  });

  return [
    getConfig('web'),
    getConfig('node'),
  ];
}