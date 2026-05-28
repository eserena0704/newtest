import { readFileSync } from "node:fs";
import { join } from "node:path";

import { z } from "zod";

const productSchema = z.object({
  id: z.string().min(2).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  category: z.string().min(2),
  description: z.string().min(10),
  tagline: z.string().min(5),
  price: z.number().nonnegative(),
  originalPrice: z.number().nonnegative().optional(),
  sessions: z.number().int().positive().optional(),
  featured: z.boolean().optional(),
  popular: z.boolean().optional(),
  giftable: z.boolean().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  duration: z.string().min(2),
  idealFor: z.string().min(2),
  includes: z.array(z.string().min(1)).min(1),
  imageKey: z
    .enum(["serviceFacial", "serviceFacialAlt", "serviceLash", "serviceLpg", "serviceIpl", "logo"])
    .optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const productsSchema = z.array(productSchema).min(1);

export type ProductRecord = z.infer<typeof productSchema>;

export const productsFilePath = "src/data/products.json";

export const sortProducts = (products: ProductRecord[]) =>
  [...products].sort((left, right) => (left.sortOrder || 0) - (right.sortOrder || 0));

export const getActiveProducts = (products: ProductRecord[]) =>
  sortProducts(products).filter((product) => product.active !== false);

export const readLocalProductRecords = () => {
  const file = readFileSync(join(process.cwd(), productsFilePath), "utf8");
  return sortProducts(productsSchema.parse(JSON.parse(file)));
};

export const readLocalProducts = () => {
  return getActiveProducts(readLocalProductRecords());
};

export const normalizeProductsForSave = (products: unknown) => {
  const ids = new Set<string>();

  return productsSchema.parse(products).map((product, index) => {
    if (ids.has(product.id)) {
      throw new Error(`Duplicate product ID: ${product.id}`);
    }

    ids.add(product.id);

    return {
      ...product,
      sortOrder: product.sortOrder ?? (index + 1) * 10,
      active: product.active !== false,
      imageUrl: product.imageUrl || undefined,
    };
  });
};
