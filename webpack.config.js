const path = require('path');

module.exports = {
  entry: {
    popup: path.join(__dirname, 'src', 'index.tsx'),
    options: path.join(__dirname, 'src', 'pages', 'Options.tsx'),
    background: path.join(__dirname, 'src', 'background.ts'),
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                namedExport: false,
                localIdentName: '[local]__[hash:base64:5]',
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(ts|tsx)$/, // Apply this rule to .ts files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  devtool: 'source-map',
};
