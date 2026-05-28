import { readSettings } from "./_shared/blob-settings.js";
import type { ApiRequest, ApiResponse } from "./_shared/http.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  res.setHeader("Cache-Control", "no-store");

  try {
    const settings = await readSettings();
    return res.status(200).json(settings);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to load settings.",
    });
  }
}
