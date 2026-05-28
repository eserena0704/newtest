import { createAdminToken, verifyAdminPassword } from "./_shared/auth.js";
import type { ApiRequest, ApiResponse } from "./_shared/http.js";
import { parseJsonBody } from "./_shared/http.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const body = parseJsonBody(req.body) as { password?: string };

    if (!body.password || !verifyAdminPassword(body.password)) {
      return res.status(401).json({ error: "Invalid admin password." });
    }

    return res.status(200).json({ token: createAdminToken() });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to log in.",
    });
  }
}
