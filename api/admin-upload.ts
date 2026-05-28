import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import type { IncomingMessage } from "node:http";

import { requireAdmin } from "./_shared/auth.js";
import type { ApiRequest, ApiResponse } from "./_shared/http.js";
import { parseJsonBody } from "./_shared/http.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const body = parseJsonBody(req.body) as HandleUploadBody;

    if (body.type === "blob.generate-client-token" && !requireAdmin(req)) {
      return res.status(401).json({ error: "Admin session required." });
    }

    const response = await handleUpload({
      body,
      request: req as unknown as IncomingMessage,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        maximumSizeInBytes: 8 * 1024 * 1024,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ source: "beauskin-admin" }),
      }),
      onUploadCompleted: async () => {
        // Product records store the returned URL when the admin saves the form.
      },
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Unable to upload image.",
    });
  }
}
