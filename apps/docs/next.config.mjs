import nextra from "nextra";

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async rewrites() {
    return [
      // Main blog paths
      {
        source: "/blog/:path*/",
        destination: "https://blog.next2app.dev/:path*/",
      },
      {
        source: "/blog/:path*",
        destination: "https://blog.next2app.dev/:path*",
      },
      // Handle assets
      {
        source: "/assets/:path*",
        destination: "https://blog.next2app.dev/assets/:path*",
      },
      // Handle content files
      {
        source: "/content/:path*",
        destination: "https://blog.next2app.dev/content/:path*",
      },
      // Handle public files
      {
        source: "/public/:path*",
        destination: "https://blog.next2app.dev/public/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/blog/:path*",
        headers: [{ key: "x-forwarded-host", value: "blog.next2app.dev" }],
      },
    ];
  },
  // Add image domains if needed
  images: {
    domains: ["blog.next2app.dev"],
  },
};

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
});

export default withNextra(nextConfig);
