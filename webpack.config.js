const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  // 번들 설정 진입점
  entry: {
    // 프로퍼티 키가 output의 [name]에 매칭
    index: './src/js/index.js',
    exchange: './src/js/controller/exchange.js',
    expense: './src/js/controller/expense.js',
    signup: './src/js/controller/signup.js',
    signin: './src/js/controller/signin.js',
    tripList: './src/js/controller/tripList.js',
    navigation: './src/js/controller/navigation.js',
  },
  // 번들링된 js 파일의 이름(filename)과 저장될 경로(path)를 지정
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/[name].bundle.js',
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin(), '...'],
  },
  plugins: [
    // 번들링된 JS 파일을 html 파일에 자동 추가해주는 플러그인
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunks: ['index', 'exchange', 'navigation'],
    }),
    new HtmlWebpackPlugin({
      filename: 'signup.html',
      template: 'src/pages/signup.html',
      chunks: ['index', 'signup'],
    }),
    new HtmlWebpackPlugin({
      filename: 'signin.html',
      template: 'src/pages/signin.html',
      chunks: ['index', 'signin'],
    }),
    new HtmlWebpackPlugin({
      filename: 'trip-list.html',
      template: 'src/pages/trip-list.html',
      chunks: ['index', 'tripList', 'navigation'],
    }),
    new HtmlWebpackPlugin({
      filename: 'trip-expense.html',
      template: 'src/pages/trip-expense.html',
      chunks: ['index', 'expense', 'navigation'],
    }),
    // css 결과물을 내보내기 위한 플러그인. 컴파일 + 번들링 CSS 파일이 저장될 경로와 이름 지정
    new MiniCssExtractPlugin({ filename: 'css/style.css' }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src/assets/images'),
          to: path.join(__dirname, 'public/assets/images'),
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src/js')],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  corejs: 3,
                  proposals: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  devServer: {
    // 서버에 콘텐츠를 제공할 위치를 알려준다. 정적 파일을 제공하려는 경우에만 필요.
    static: {
      directory: path.join(__dirname, 'public'),
    },
    open: true,
    port: 5500,
    // 별도의 API 백엔드 개발 서버가 있고 동일한 도메인에서 API 요청을 보내려는 경우 일부 URL을 프록시하는 것이 유용할 수 있다.
    // PORT 5500에는 api 서버가, PORT 5500에는 devServer가 실행중이기에 호스트와 포트를 명시하지 않으면 404에러가 발생한다.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
    },
    onListening(devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      const { port } = devServer.server.address();
      console.log('Listening on port:', port);
    },
  },
  // 소스 맵(Source Map)은 디버깅을 위해 번들링된 파일과 번들링되기 이전의 소스 파일을 연결해주는 파일이다.
  devtool: 'source-map',
  mode: 'production',
};
