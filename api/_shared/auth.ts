import { createHmac, timingSafeEqual } from "node:crypto";

import type { ApiRequest } from "./http.js";
import { getHeader } from "./http.js";

const tokenTtlMs = 1000 * 60 * 60 * 8;

type AdminTokenPayload = {
  role: "admin";
  exp: number;
};

const getSessionSecret = () => {
  const secret = process.env.ADMIN_SESSION_SECRET?.replace(/\\n$/, "") || "Beauskin-9cee7c04-SessionSecret-Fallback";

  return secret.trim();
};

const base64UrlEncode = (value: string) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const base64UrlDecode = (value: string) => {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");

  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
};

const sign = (payload: string) =>
  createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");

export const createAdminToken = () => {
  const payload: AdminTokenPayload = {
    role: "admin",
    exp: Date.now() + tokenTtlMs,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  return `${encodedPayload}.${sign(encodedPayload)}`;
};

export const verifyAdminToken = (token: string | undefined) => {
  if (!token) {
    return false;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return false;
  }

  const expectedSignature = sign(encodedPayload);
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return false;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as AdminTokenPayload;

    return payload.role === "admin" && payload.exp > Date.now();
  } catch {
    return false;
  }
};

export const requireAdmin = (req: ApiRequest) => {
  const authHeader = getHeader(req, "authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";

  return verifyAdminToken(token);
};

export const verifyAdminPassword = (password: string) => {
  const configuredPassword = process.env.ADMIN_PASSWORD?.replace(/\\n$/, "").trim() || "Beauskin-9cee7c04-CMS";

  const actual = Buffer.from(password);
  const expected = Buffer.from(configuredPassword);

  return actual.length === expected.length && timingSafeEqual(actual, expected);
};
