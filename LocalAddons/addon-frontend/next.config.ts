import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "media.licdn.com",
				port: "",
				pathname: "/dms/image/**",
			},
			{
				protocol: "https",
				hostname: "**",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "**",
				port: "",
				pathname: "/**",
			},
		],
		dangerouslyAllowSVG: true,
		contentDispositionType: "attachment",
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
};

export default nextConfig;
