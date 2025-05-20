/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
          {
            source: '/api/:path*',
            headers: [
              {
                key: 'Connection',
                value: 'keep-alive',
              },
            ],
          },
        ];
      },
      experimental: {
        serverComponentsExternalPackages: ['sharp'],
      },
      api: {
        bodyParser: {
          sizeLimit: '100mb',
        },
        responseLimit: '100mb',
      },
};

export default nextConfig;
