import path from 'path';

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Add a rule to handle .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'file-loader',
    });

    // config.module.rules.push({
    //   test: /\.module\.css$/,
    //   use: ['style-loader', 'css-loader?modules'],
    // });

    return config;
  },
};

export default nextConfig;
