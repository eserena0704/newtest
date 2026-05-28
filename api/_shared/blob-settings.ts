import { get, list, put } from "@vercel/blob";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const settingsFilePath = "api/_shared/settings.json";
const settingsBlobPrefix = "cms/settings/";
const defaultSettingsBlobPath = "cms/settings.json";

export type SiteSettings = {
  chatbotScript: string;
};

const getBlobToken = () => {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.replace(/\\n/g, "").trim();
  return token || null;
};

const streamToText = async (stream: ReadableStream<Uint8Array>) => {
  return new Response(stream).text();
};

export const readSettingsFromBlob = async () => {
  const token = getBlobToken();
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  }

  const listed = await list({
    prefix: settingsBlobPrefix,
    limit: 100,
    token,
  });

  const latestSettingsBlob = listed.blobs
    .filter((blob) => blob.pathname.endsWith(".json"))
    .sort((left, right) => right.uploadedAt.getTime() - left.uploadedAt.getTime())[0];

  const blob = await get(latestSettingsBlob?.pathname || defaultSettingsBlobPath, {
    access: "public",
    token,
  });

  if (!blob || blob.statusCode !== 200 || !blob.stream) {
    throw new Error("Settings blob was not found.");
  }

  const text = await streamToText(blob.stream);
  return JSON.parse(text) as SiteSettings;
};

export const readSettings = async (): Promise<SiteSettings> => {
  try {
    return await readSettingsFromBlob();
  } catch (err) {
    // Fallback: read from local file
    try {
      const file = readFileSync(join(process.cwd(), settingsFilePath), "utf8");
      return JSON.parse(file) as SiteSettings;
    } catch {
      return { chatbotScript: "" };
    }
  }
};

export const saveSettingsToBlob = async (settings: SiteSettings) => {
  const token = getBlobToken();
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  }

  const pathname = `${settingsBlobPrefix}${Date.now()}.json`;

  const blob = await put(
    pathname,
    `${JSON.stringify(settings, null, 2)}\n`,
    {
      access: "public",
      cacheControlMaxAge: 60,
      contentType: "application/json; charset=utf-8",
      token,
    },
  );

  return blob;
};

export const saveSettings = async (settings: SiteSettings): Promise<{ source: string; url?: string }> => {
  // Write locally for development persistence
  try {
    writeFileSync(join(process.cwd(), settingsFilePath), JSON.stringify(settings, null, 2), "utf8");
  } catch (err) {
    console.warn("Failed to save settings locally:", err);
  }

  try {
    const blob = await saveSettingsToBlob(settings);
    return { source: "blob", url: blob.url };
  } catch {
    return { source: "local" };
  }
};
