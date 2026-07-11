const BASE_URL = "https://souki.dz";

export default async function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/login", "/register"] },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
