import path from 'path';

const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add a rule to handle .node files
    config.module.rules.push({
     test: /\.node$/,
     use: 'file-loader',
    });

    return config;
  },
}

export default nextConfig;