/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.statcrusher.com',
			},
		],
	}
};

export default nextConfig;
