import serviceFacial from "@/assets/service-facial.jpg";
import serviceFacialAlt from "@/assets/service-facial-NQuhQOPC.jpg";
import serviceLash from "@/assets/service-lash.jpg";
import serviceLpg from "@/assets/service-lpg.jpg";
import serviceIpl from "@/assets/service-ipl.jpg";
import logo from "@/assets/logo.png";
import rawProducts from "./products.json";
import type { ProductImageKey, StoreProductRecord } from "./productTypes";

export type StoreProduct = StoreProductRecord & {
  image: string;
};

export const storeCategories = [
  "All Packages",
  "Facials",
  "IPL Hair Removal",
  "Lash Treatments",
  "LPG Body",
  "Gift Vouchers",
];

export const conciergeWhatsAppUrl =
  "https://wa.me/6589589156?text=Hi%20Beauskin%2C%20I%E2%80%99d%20like%20help%20choosing%20the%20right%20package.";

export const checkoutPromisePoints = [
  "Secure Stripe-hosted checkout",
  "Instant payment confirmation",
  "Redeem and schedule with our team after purchase",
];

export const productImageOptions: Array<{ key: ProductImageKey; label: string }> = [
  { key: "serviceFacial", label: "Facial treatment" },
  { key: "serviceFacialAlt", label: "Facial room" },
  { key: "serviceIpl", label: "IPL treatment" },
  { key: "serviceLash", label: "Lash treatment" },
  { key: "serviceLpg", label: "LPG body treatment" },
  { key: "logo", label: "Beauskin logo" },
];

const imageMap: Record<ProductImageKey, string> = {
  serviceFacial,
  serviceFacialAlt,
  serviceIpl,
  serviceLash,
  serviceLpg,
  logo,
};

export const resolveProductImage = (product: StoreProductRecord) => {
  if (product.imageUrl) {
    return product.imageUrl;
  }

  return imageMap[product.imageKey || "serviceFacial"];
};

export const storefrontCatalog: StoreProduct[] = (rawProducts as StoreProductRecord[])
  .filter((product) => product.active !== false)
  .sort((left, right) => (left.sortOrder || 0) - (right.sortOrder || 0))
  .map((product) => ({
    ...product,
    image: resolveProductImage(product),
  }));

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
