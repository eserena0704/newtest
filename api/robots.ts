import type { ApiRequest, ApiResponse } from "./_shared/http.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const host = (req.headers?.host as string) || "newtest-two-nu.vercel.app";
  const proto = (req.headers?.["x-forwarded-proto"] as string) || "https";
  const domain = `${proto}://${host}`;

  const text = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /

Sitemap: ${domain}/sitemap.xml
`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");

  const rawRes = res as any;
  if (typeof rawRes.writeHead === "function") {
    rawRes.writeHead(200);
    rawRes.end(text);
  } else if (typeof rawRes.send === "function") {
    rawRes.status(200).send(text);
  } else {
    rawRes.status(200).json({ text });
  }
}
