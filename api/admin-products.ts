import { requireAdmin } from "./_shared/auth.js";
import { readProductsForAdmin, saveProductsToBlob } from "./_shared/blob-products.js";
import type { ApiRequest, ApiResponse } from "./_shared/http.js";
import { parseJsonBody } from "./_shared/http.js";
import { normalizeProductsForSave } from "./_shared/products.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireAdmin(req)) {
    return res.status(401).json({ error: "Admin session required." });
  }

  res.setHeader("Cache-Control", "no-store");

  try {
    if (req.method === "GET") {
      return res.status(200).json(await readProductsForAdmin());
    }

    if (req.method === "POST") {
      const body = parseJsonBody(req.body) as { products?: unknown };
      const products = normalizeProductsForSave(body.products);
      const result = await saveProductsToBlob(products);

      return res.status(200).json({
        ok: true,
        pathname: result.blob.pathname,
        url: result.blob.url,
        message: "Products saved to Vercel Blob. Storefront updates without a redeploy.",
      });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to manage products.",
    });
  }
}
