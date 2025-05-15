import path from 'path';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig = {
  reactStrictMode: false,
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

const withNextIntl = createNextIntlPlugin();

// Export the enhanced config
export default withNextIntl(nextConfig);
