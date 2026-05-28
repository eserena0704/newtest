import type { ApiRequest, ApiResponse } from "./_shared/http.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const host = (req.headers?.host as string) || "newtest-two-nu.vercel.app";
  const proto = (req.headers?.["x-forwarded-proto"] as string) || "https";
  const domain = `${proto}://${host}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${domain}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domain}/store</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");

  const rawRes = res as any;
  if (typeof rawRes.writeHead === "function") {
    rawRes.writeHead(200);
    rawRes.end(xml);
  } else if (typeof rawRes.send === "function") {
    rawRes.status(200).send(xml);
  } else {
    rawRes.status(200).json({ xml });
  }
}
