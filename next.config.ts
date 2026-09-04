import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ruumide ülevaade on avalehe osa (#ruumid); vana aadress suunatakse sinna.
  async redirects() {
    return [{ source: "/ruumide-rent", destination: "/#ruumid", permanent: true }];
  },
};

export default nextConfig;
