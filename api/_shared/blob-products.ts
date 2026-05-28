import { get, list, put } from "@vercel/blob";

import {
  getActiveProducts,
  normalizeProductsForSave,
  readLocalProductRecords,
  type ProductRecord,
} from "./products.js";

const productsBlobPrefix = "cms/products/";
const legacyProductsBlobPath = "cms/products.json";

const getBlobToken = () => {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.replace(/\\n/g, "").trim();

  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  }

  return token;
};

const streamToText = async (stream: ReadableStream<Uint8Array>) => {
  return new Response(stream).text();
};

export const readProductsFromBlob = async () => {
  const token = getBlobToken();
  const listed = await list({
    prefix: productsBlobPrefix,
    limit: 1000,
    token,
  });
  const latestProductBlob = listed.blobs
    .filter((blob) => blob.pathname.endsWith(".json"))
    .sort((left, right) => right.uploadedAt.getTime() - left.uploadedAt.getTime())[0];

  const blob = await get(latestProductBlob?.pathname || legacyProductsBlobPath, {
    access: "public",
    token,
  });

  if (!blob || blob.statusCode !== 200 || !blob.stream) {
    throw new Error("Product catalog blob was not found.");
  }

  const products = normalizeProductsForSave(JSON.parse(await streamToText(blob.stream)));

  return {
    products,
    etag: blob.blob.etag,
    uploadedAt: blob.blob.uploadedAt,
  };
};

export const saveProductsToBlob = async (products: ProductRecord[]) => {
  const normalizedProducts = normalizeProductsForSave(products);
  const pathname = `${productsBlobPrefix}${Date.now()}.json`;

  const blob = await put(
    pathname,
    `${JSON.stringify(normalizedProducts, null, 2)}\n`,
    {
      access: "public",
      cacheControlMaxAge: 60,
      contentType: "application/json; charset=utf-8",
      token: getBlobToken(),
    },
  );

  return {
    blob,
    products: normalizedProducts,
  };
};

export const readProductsForAdmin = async () => {
  try {
    const { products, etag, uploadedAt } = await readProductsFromBlob();

    return {
      products,
      source: "blob",
      etag,
      uploadedAt,
    };
  } catch {
    return {
      products: readLocalProductRecords(),
      source: "local",
    };
  }
};

export const readProductsForStore = async () => {
  try {
    const { products, etag, uploadedAt } = await readProductsFromBlob();

    return {
      products: getActiveProducts(products),
      source: "blob",
      etag,
      uploadedAt,
    };
  } catch {
    return {
      products: getActiveProducts(readLocalProductRecords()),
      source: "local",
    };
  }
};
