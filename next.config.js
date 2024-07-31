// const withPWA = require("@ducanh2912/next-pwa").default({
//     dest: "public",
//     cacheOnFrontEndNav: true,
//     aggressiveFrontEndNavCaching: true,
//     reloadOnOnline: true,
//     swcMinify: true,
//     disable: process.env.NODE_ENV === "development",
//     workboxOptions: {
//         disableDevLogs: true,
//     },
//     // ... other options you like
// });

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
        removeConsole: process.env.NODE_ENV !== "development",
    },
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'pbs.twimg.com',
            port: '',
            pathname: '/**'
        }]
    }
}

const withPWA = require("next-pwa")({
    dest: "public", // Destination directory for the PWA files
    disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
    register: true, // Register the PWA service worker
    skipWaiting: true, // Skip waiting for service worker activation
});

// Export the combined configuration for Next.js with PWA support
module.exports = withPWA(nextConfig);

// module.exports = withPWA(nextConfig);

// module.exports = nextConfig
