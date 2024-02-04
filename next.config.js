/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites () {
    return [
      {
        source: "/api/:path*",
        destination: "http://172.168.20.9:32001/api/:path*"
      },
      {
        source: "/action/:path*",
        destination: "http://172.168.20.9:32001/action/:path*"
      },
      {
        source: "/stomp/:path*",
        destination: "http://172.168.20.9:32001/stomp/:path*"
      },
      {
        source: "/telnetssh/:path*",
        destination: "http://172.168.20.9:28001/telnetssh/:path*"
      }
    ];
  }
};

module.exports = nextConfig;
