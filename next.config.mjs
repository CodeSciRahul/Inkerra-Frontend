/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
          "inkerra-user-profile.s3.eu-north-1.amazonaws.com", // Add your S3 bucket hostname here
        ],
      },    
};

export default nextConfig;
