import { requireAdmin } from "./_shared/auth.js";
import { saveSettings } from "./_shared/blob-settings.js";
import type { ApiRequest, ApiResponse } from "./_shared/http.js";
import { parseJsonBody } from "./_shared/http.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireAdmin(req)) {
    return res.status(401).json({ error: "Admin session required." });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const body = parseJsonBody(req.body) as { chatbotScript?: string };
    const chatbotScript = typeof body.chatbotScript === "string" ? body.chatbotScript : "";

    const result = await saveSettings({ chatbotScript });

    return res.status(200).json({
      ok: true,
      source: result.source,
      url: result.url,
      message: "Site settings saved successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to save settings.",
    });
  }
}
