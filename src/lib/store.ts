import { storefrontCatalog, type StoreProduct } from "@/data/storeCatalog";

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CartLineItem = {
  product: StoreProduct;
  quantity: number;
  lineTotal: number;
  lineSavings: number;
};

const getCatalogMap = (catalog: StoreProduct[] = storefrontCatalog) =>
  new Map(catalog.map((product) => [product.id, product]));

export const normalizeCartItems = (
  items: CartItem[],
  catalog: StoreProduct[] = storefrontCatalog,
) => {
  const merged = new Map<string, number>();
  const catalogMap = getCatalogMap(catalog);

  items.forEach((item) => {
    if (!catalogMap.has(item.productId)) {
      return;
    }

    const quantity = Math.min(Math.max(Math.round(item.quantity || 0), 0), 10);

    if (quantity <= 0) {
      return;
    }

    merged.set(item.productId, (merged.get(item.productId) || 0) + quantity);
  });

  return Array.from(merged.entries()).map(([productId, quantity]) => ({
    productId,
    quantity: Math.min(quantity, 10),
  }));
};

export const buildCartLineItems = (
  items: CartItem[],
  catalog: StoreProduct[] = storefrontCatalog,
) => {
  const catalogMap = getCatalogMap(catalog);

  return normalizeCartItems(items, catalog)
    .map((item) => {
      const product = catalogMap.get(item.productId);

      if (!product) {
        return null;
      }

      const savingsPerUnit = (product.originalPrice || product.price) - product.price;

      return {
        product,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
        lineSavings: savingsPerUnit > 0 ? savingsPerUnit * item.quantity : 0,
      };
    })
    .filter(Boolean) as CartLineItem[];
};

export const getCartCount = (items: CartItem[], catalog: StoreProduct[] = storefrontCatalog) =>
  normalizeCartItems(items, catalog).reduce((count, item) => count + item.quantity, 0);

export const getCartSubtotal = (items: CartItem[], catalog: StoreProduct[] = storefrontCatalog) =>
  buildCartLineItems(items, catalog).reduce((total, item) => total + item.lineTotal, 0);

export const getCartSavings = (items: CartItem[], catalog: StoreProduct[] = storefrontCatalog) =>
  buildCartLineItems(items, catalog).reduce((total, item) => total + item.lineSavings, 0);
