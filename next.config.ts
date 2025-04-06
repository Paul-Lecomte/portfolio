import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    devIndicators: false,
    webpack: (config) => {
        // Resolve Konva to the browser-friendly version
        config.resolve.alias = {
            ...config.resolve.alias,
            'konva/lib/index-node': 'konva/lib/index-browser', // Ensures the correct version is used
        };
        return config;
    },
};

export default nextConfig;