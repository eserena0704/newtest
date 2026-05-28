import Stripe from "stripe";
import { z } from "zod";

import { readProductsForStore } from "./_shared/blob-products.js";
import type { ApiRequest, ApiResponse } from "./_shared/http.js";
import { parseJsonBody } from "./_shared/http.js";
import type { ProductRecord } from "./_shared/products.js";

const requestSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(20),
});

const getBaseUrl = (req: ApiRequest) => {
  const configuredUrl = process.env.PUBLIC_SITE_URL?.replace(/\/$/, "");

  if (configuredUrl) {
    return configuredUrl;
  }

  const origin = req.headers?.origin;

  if (origin) {
    return String(origin).replace(/\/$/, "");
  }

  const protocol = req.headers?.["x-forwarded-proto"] || "https";
  const host = req.headers?.host;

  return `${protocol}://${host}`;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST for checkout." });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY?.replace(/\\n$/, "").trim();

  if (!secretKey) {
    return res.status(500).json({
      error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY to enable checkout.",
    });
  }

  try {
    const rawBody = parseJsonBody(req.body);
    const parsed = requestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return res.status(400).json({
        error: "The checkout payload is invalid.",
        details: parsed.error.flatten(),
      });
    }

    const normalizedItems = parsed.data.items.reduce(
      (accumulator, item) => {
        accumulator.set(item.productId, (accumulator.get(item.productId) || 0) + item.quantity);
        return accumulator;
      },
      new Map<string, number>(),
    );

    const { products } = await readProductsForStore();
    const catalogMap = new Map<string, ProductRecord>(
      products.map((product) => [product.id, product]),
    );
    const line_items = Array.from(normalizedItems.entries()).map(([productId, quantity]) => {
      const product = catalogMap.get(productId);

      if (!product) {
        throw new Error(`Unknown product requested: ${productId}`);
      }

      return {
        quantity,
        price_data: {
          currency: "sgd",
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: product.name,
            description: product.tagline,
            metadata: {
              package_id: product.id,
              category: product.category,
            },
          },
        },
      };
    });

    const stripe = new Stripe(secretKey, {
      apiVersion: "2026-03-25.dahlia",
    });
    const baseUrl = getBaseUrl(req);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      billing_address_collection: "required",
      customer_creation: "always",
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      success_url: `${baseUrl}/store?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/store?checkout=cancelled`,
      line_items,
      metadata: {
        source: "beauskin-luxury-store",
        package_ids: Array.from(normalizedItems.keys()).join(","),
      },
    });

    return res.status(200).json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create a Stripe checkout session.";

    return res.status(500).json({ error: message });
  }
}
