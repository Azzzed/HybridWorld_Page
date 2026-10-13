import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Hay dos layouts raíz (inglés y español) y ninguno arriba de ambos: la
    // 404 de las URLs que no existen vive en app/global-not-found.tsx.
    globalNotFound: true,
    // El CSS va dentro del HTML en vez de en <link>: quita las peticiones que
    // bloquean el primer pintado. Casi todas las visitas llegan de Google por
    // primera vez, que es el caso en que esto ayuda.
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
  },
  /**
   * URLs del sitio anterior (GoDaddy) a su equivalente en el nuevo, con 301
   * explícito (`permanent` respondería 308). /services existe también aquí,
   * así que conserva su URL.
   */
  async redirects() {
    return [
      { source: "/about-us-1", destination: "/", statusCode: 301 },
      { source: "/contact-us-1", destination: "/locations", statusCode: 301 },
      { source: "/price-list-1", destination: "/services", statusCode: 301 },
      { source: "/ola/services/schedule-service", destination: "/locations", statusCode: 301 },
      { source: "/gallery", destination: "/#gallery", statusCode: 301 },
    ];
  },
};

export default nextConfig;
