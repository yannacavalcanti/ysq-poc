import type { NextConfig } from "next";

// Publicado no GitHub Pages em https://<usuário>.github.io/ysq-poc/
const basePath = "/ysq-poc";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
