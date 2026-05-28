import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Gift,
  LockKeyhole,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";

import heroFacial from "@/assets/hero-facial.jpg";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  checkoutPromisePoints,
  conciergeWhatsAppUrl,
  formatCurrency,
  resolveProductImage,
  storeCategories,
  type StoreProduct,
  storefrontCatalog,
} from "@/data/storeCatalog";
import type { StoreProductRecord } from "@/data/productTypes";
import {
  buildCartLineItems,
  getCartCount,
  getCartSavings,
  getCartSubtotal,
  normalizeCartItems,
  type CartItem,
} from "@/lib/store";

const cartStorageKey = "beauskin-store-cart";

type SortOption = "curated" | "price-low" | "price-high";

type OrderSummaryProps = {
  cartItems: CartItem[];
  checkoutError: string;
  isCheckingOut: boolean;
  products: StoreProduct[];
  onCheckout: () => Promise<void>;
  onUpdateQuantity: (productId: string, quantity: number) => void;
};

const getVisibleProducts = (category: string, sortBy: SortOption, products: StoreProduct[]) => {
  const filtered =
    category === "All Packages"
      ? [...products]
      : products.filter((product) => product.category === category);

  if (sortBy === "price-low") {
    filtered.sort((left, right) => left.price - right.price);
  }

  if (sortBy === "price-high") {
    filtered.sort((left, right) => right.price - left.price);
  }

  if (sortBy === "curated") {
    filtered.sort((left, right) => {
      const leftWeight = Number(left.featured) * 2 + Number(left.popular);
      const rightWeight = Number(right.featured) * 2 + Number(right.popular);

      return rightWeight - leftWeight || left.price - right.price;
    });
  }

  return filtered;
};

const OrderSummary = ({
  cartItems,
  checkoutError,
  isCheckingOut,
  products,
  onCheckout,
  onUpdateQuantity,
}: OrderSummaryProps) => {
  const lineItems = buildCartLineItems(cartItems, products);
  const subtotal = getCartSubtotal(cartItems, products);
  const savings = getCartSavings(cartItems, products);
  const itemCount = getCartCount(cartItems, products);

  return (
    <div className="rounded-[2rem] border border-primary/10 bg-primary px-6 py-7 text-primary-foreground shadow-[0_30px_90px_-50px_rgba(25,25,25,0.85)] md:px-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="luxury-subheading text-primary-foreground/60">Order Summary</p>
          <h2 className="mt-2 text-3xl leading-none">Your Beauskin Edit</h2>
        </div>
        <div className="rounded-full border border-primary-foreground/15 px-4 py-2 text-sm text-primary-foreground/75">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </div>
      </div>

      {lineItems.length === 0 ? (
        <div className="mt-8 rounded-[1.5rem] border border-primary-foreground/12 bg-primary-foreground/5 p-5">
          <p className="text-base text-primary-foreground/80">
            Build your order from the package collection and your summary will update here in real time.
          </p>
        </div>
      ) : (
        <div className="mt-7 space-y-4">
          {lineItems.map(({ product, quantity, lineTotal }) => (
            <div
              key={product.id}
              className="rounded-[1.5rem] border border-primary-foreground/12 bg-primary-foreground/5 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg leading-tight">{product.name}</p>
                  <p className="mt-1 text-sm text-primary-foreground/65">{product.duration}</p>
                </div>
                <p className="text-base">{formatCurrency(lineTotal)}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="inline-flex items-center rounded-full border border-primary-foreground/12">
                  <button
                    type="button"
                    aria-label={`Decrease ${product.name} quantity`}
                    className="px-3 py-2 text-primary-foreground/70 transition hover:text-primary-foreground"
                    onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-10 text-center text-sm">{quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${product.name} quantity`}
                    className="px-3 py-2 text-primary-foreground/70 transition hover:text-primary-foreground"
                    onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-primary-foreground/65">
                  {product.sessions ? `${product.sessions} sessions` : "Giftable credit"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-7 space-y-3 border-t border-primary-foreground/12 pt-5 text-sm">
        <div className="flex items-center justify-between text-primary-foreground/70">
          <span>Subtotal</span>
          <span className="text-primary-foreground">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-primary-foreground/70">
          <span>Your package savings</span>
          <span className="text-primary-foreground">{formatCurrency(savings)}</span>
        </div>
      </div>

      {checkoutError ? (
        <div className="mt-5 rounded-2xl border border-[#dfb8b2] bg-[#f5ded8] px-4 py-3 text-sm text-[#5f332d]">
          {checkoutError}
        </div>
      ) : null}

      <Button
        className="mt-6 h-12 w-full rounded-full bg-primary-foreground px-5 text-sm uppercase tracking-[0.25em] text-primary hover:bg-primary-foreground/90"
        disabled={lineItems.length === 0 || isCheckingOut}
        onClick={() => {
          void onCheckout();
        }}
      >
        {isCheckingOut ? "Preparing Checkout..." : "Checkout with Stripe"}
        <ArrowRight className="h-4 w-4" />
      </Button>

      <a
        href={conciergeWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-primary-foreground/15 px-5 py-3 text-xs uppercase tracking-[0.25em] text-primary-foreground/75 transition hover:border-primary-foreground/35 hover:text-primary-foreground"
      >
        Ask Our Concierge
      </a>

      <div className="mt-6 space-y-3 border-t border-primary-foreground/12 pt-5">
        {checkoutPromisePoints.map((point) => (
          <div key={point} className="flex items-start gap-3 text-sm text-primary-foreground/72">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--rose-gold))]" />
            <span>{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Store = () => {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All Packages");
  const [sortBy, setSortBy] = useState<SortOption>("curated");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [products, setProducts] = useState<StoreProduct[]>(storefrontCatalog);
  const [productLoadError, setProductLoadError] = useState("");

  const checkoutStatus = searchParams.get("checkout");
  const visibleProducts = getVisibleProducts(activeCategory, sortBy, products);
  const featuredProducts = products.filter((product) => product.featured).slice(0, 3);
  const itemCount = getCartCount(cartItems, products);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });
        const data = await response.json().catch(() => null);

        if (!response.ok || !Array.isArray(data?.products)) {
          throw new Error(data?.error || "Unable to load the latest products.");
        }

        const nextProducts = (data.products as StoreProductRecord[]).map((product) => ({
          ...product,
          image: resolveProductImage(product),
        }));

        if (!isMounted || nextProducts.length === 0) {
          return;
        }

        setProducts(nextProducts);
        setCartItems((currentItems) => normalizeCartItems(currentItems, nextProducts));
        setProductLoadError("");
      } catch (error) {
        if (isMounted) {
          setProductLoadError(
            error instanceof Error ? error.message : "Unable to load the latest products.",
          );
        }
      }
    };

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const storedCart = window.localStorage.getItem(cartStorageKey);

    if (!storedCart) {
      return;
    }

    try {
      setCartItems(normalizeCartItems(JSON.parse(storedCart)));
    } catch {
      window.localStorage.removeItem(cartStorageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      cartStorageKey,
      JSON.stringify(normalizeCartItems(cartItems, products)),
    );
  }, [cartItems, products]);

  useEffect(() => {
    if (checkoutStatus === "success") {
      setCartItems([]);
      window.localStorage.removeItem(cartStorageKey);
    }
  }, [checkoutStatus]);

  const setProductQuantity = (productId: string, quantity: number) => {
    setCheckoutError("");
    setCartItems((currentItems) =>
      normalizeCartItems(
        [
          ...currentItems.filter((item) => item.productId !== productId),
          ...(quantity > 0 ? [{ productId, quantity }] : []),
        ],
        products,
      ),
    );
  };

  const addToCart = (productId: string) => {
    const existingQuantity =
      cartItems.find((item) => item.productId === productId)?.quantity || 0;

    setProductQuantity(productId, existingQuantity + 1);
    setIsCartOpen(true);
  };

  const handleCheckout = async () => {
    setCheckoutError("");
    setIsCheckingOut(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: normalizeCartItems(cartItems, products),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.checkoutUrl) {
        throw new Error(
          data?.error ||
            "Stripe checkout is not connected yet. Add your Stripe key and try again.",
        );
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Stripe checkout is not available right now.",
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  const statusMessage =
    checkoutStatus === "success"
      ? "Payment confirmed. Your Beauskin order was received and the cart has been cleared."
      : checkoutStatus === "cancelled"
        ? "Checkout was cancelled. Your package selection is still here if you want to continue."
        : "";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="bg-[#f7f1eb] pt-12 md:pt-14">
        <section className="relative isolate overflow-hidden bg-stone-950 text-white">
          <img
            src={heroFacial}
            alt="Beauskin treatment room"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(19,19,19,0.92)_10%,rgba(19,19,19,0.72)_42%,rgba(19,19,19,0.18)_100%)]" />
          <div className="relative mx-auto grid min-h-[calc(100svh-3rem)] max-w-7xl items-end gap-10 px-6 pb-12 pt-20 md:min-h-[calc(100svh-3.5rem)] md:grid-cols-[minmax(0,1fr)_22rem] md:pb-16 md:pt-24">
            <div className="max-w-2xl">
              <p className="luxury-subheading text-white/65">The Beauskin Store</p>
              <h1 className="mt-4 max-w-xl text-5xl leading-[0.92] md:text-7xl">
                Luxury treatment packages, composed for a decisive checkout.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-white/72 md:text-lg">
                Shop the clinic's signature edits, secure your package through Stripe, and let our
                team arrange the in-clinic experience around you afterwards.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#catalog"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.28em] text-stone-950 transition hover:bg-white/90"
                >
                  Shop Packages
                </a>
                <a
                  href={conciergeWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.28em] text-white/78 transition hover:border-white/45 hover:text-white"
                >
                  Concierge Advice
                </a>
              </div>
            </div>

            <div className="grid gap-5 md:pb-4">
              <div className="border-l border-white/15 pl-5">
                <p className="luxury-subheading text-white/55">Secure flow</p>
                <p className="mt-2 text-2xl">Stripe-hosted checkout with real-time order summary.</p>
              </div>
              <div className="border-l border-white/15 pl-5">
                <p className="luxury-subheading text-white/55">Curated value</p>
                <p className="mt-2 text-2xl">Packages built for glow maintenance, bridal prep, and repeat appointments.</p>
              </div>
              <div className="border-l border-white/15 pl-5">
                <p className="luxury-subheading text-white/55">After payment</p>
                <p className="mt-2 text-2xl">Your confirmation lands first, our scheduling support follows immediately after.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-primary/10 bg-[#fbf7f3]">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 md:grid-cols-3 md:py-10">
            <div>
              <p className="luxury-subheading text-foreground/55">Why This Store Works</p>
              <p className="mt-3 text-2xl leading-tight text-foreground">
                Built for clients who want product clarity before they decide.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <Sparkles className="mt-1 h-5 w-5 text-[hsl(var(--rose-gold))]" />
              <p className="text-sm leading-7 text-foreground/72">
                Every package tells you what it is for, how long it runs, and what is included.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <LockKeyhole className="mt-1 h-5 w-5 text-[hsl(var(--rose-gold))]" />
              <p className="text-sm leading-7 text-foreground/72">
                Checkout is prepared on the server and handed off to Stripe's hosted payment page.
              </p>
            </div>
          </div>
        </section>

        {statusMessage ? (
          <section className="border-b border-primary/10 bg-[#f3ebe4]">
            <div className="mx-auto max-w-7xl px-6 py-4 text-sm text-foreground/80">
              {statusMessage}
            </div>
          </section>
        ) : null}

        {productLoadError ? (
          <section className="border-b border-primary/10 bg-[#f3ebe4]">
            <div className="mx-auto max-w-7xl px-6 py-4 text-sm text-foreground/70">
              Showing the bundled catalogue because the live CMS catalogue could not load:{" "}
              {productLoadError}
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="luxury-subheading text-foreground/55">Featured Packages</p>
              <h2 className="mt-3 max-w-xl text-4xl leading-none text-foreground md:text-5xl">
                The current Beauskin edit.
              </h2>
            </div>
            <p className="hidden max-w-sm text-sm leading-7 text-foreground/68 md:block">
              Three anchor packages lead the collection: one for glow, one for milestones, one for
              disciplined body maintenance.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr_1fr]">
            {featuredProducts.map((product, index) => (
              <article
                key={product.id}
                className={`group overflow-hidden rounded-[2rem] border border-primary/10 bg-[#f8f3ee] ${
                  index === 0 ? "lg:row-span-2" : ""
                }`}
              >
                <div className={`relative overflow-hidden ${index === 0 ? "aspect-[4/5]" : "aspect-[5/4]"}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_12%,rgba(13,13,13,0.76)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/15 px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-white/72">
                      {product.popular ? <Star className="h-3.5 w-3.5 fill-current" /> : null}
                      {product.category}
                    </div>
                    <h3 className="mt-4 text-3xl leading-none">{product.name}</h3>
                    <p className="mt-3 max-w-md text-sm leading-7 text-white/76">{product.tagline}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="catalog" className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_23rem] xl:items-start">
            <div>
              <div className="sticky top-12 z-30 border-y border-primary/10 bg-[#f7f1eb]/95 py-5 backdrop-blur md:top-14">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {storeCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em] transition ${
                          activeCategory === category
                            ? "bg-primary text-primary-foreground"
                            : "border border-primary/12 bg-white/70 text-foreground/70 hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="luxury-subheading text-foreground/55">Shop Catalogue</p>
                      <p className="mt-1 text-sm text-foreground/68">
                        Filter by treatment family and add packages directly into your order.
                      </p>
                    </div>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                      <SelectTrigger className="h-11 w-[180px] rounded-full border-primary/12 bg-white/85 px-4 text-xs uppercase tracking-[0.2em]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="curated">Curated</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-7 md:grid-cols-2">
                {visibleProducts.map((product) => {
                  const quantity =
                    cartItems.find((item) => item.productId === product.id)?.quantity || 0;

                  return (
                    <article
                      key={product.id}
                      className="overflow-hidden rounded-[2rem] border border-primary/10 bg-[#fbf7f3] shadow-[0_30px_80px_-60px_rgba(28,28,28,0.55)]"
                    >
                      <div className="relative aspect-[5/4] overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-700 hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_18%,rgba(11,11,11,0.6)_100%)]" />
                        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                          <span className="rounded-full border border-white/15 bg-black/15 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/72">
                            {product.category}
                          </span>
                          {product.popular ? (
                            <span className="rounded-full border border-white/15 bg-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white">
                              Most Loved
                            </span>
                          ) : null}
                        </div>
                        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
                          <div>
                            <p className="text-2xl leading-none">{product.name}</p>
                            <p className="mt-2 text-sm text-white/72">{product.duration}</p>
                          </div>
                          <p className="text-2xl">{formatCurrency(product.price)}</p>
                        </div>
                      </div>

                      <div className="space-y-5 p-6">
                        <div>
                          <p className="text-sm leading-7 text-foreground/78">{product.description}</p>
                          <p className="mt-3 text-sm text-foreground/55">
                            Ideal for: {product.idealFor}
                          </p>
                        </div>

                        <div className="space-y-2 border-y border-primary/8 py-4">
                          {product.includes.map((item) => (
                            <div key={item} className="flex items-start gap-3 text-sm text-foreground/74">
                              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[hsl(var(--rose-gold))]" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="text-xs uppercase tracking-[0.24em] text-foreground/55">
                              {product.sessions ? `${product.sessions} sessions` : "Giftable"}
                            </span>
                            {product.originalPrice ? (
                              <span className="text-sm text-foreground/38 line-through">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            ) : null}
                          </div>

                          {quantity > 0 ? (
                            <div className="inline-flex items-center rounded-full border border-primary/12 bg-white">
                              <button
                                type="button"
                                className="px-3 py-2 text-foreground/70 transition hover:text-foreground"
                                onClick={() => setProductQuantity(product.id, quantity - 1)}
                                aria-label={`Decrease ${product.name} quantity`}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="min-w-10 text-center text-sm">{quantity}</span>
                              <button
                                type="button"
                                className="px-3 py-2 text-foreground/70 transition hover:text-foreground"
                                onClick={() => setProductQuantity(product.id, quantity + 1)}
                                aria-label={`Increase ${product.name} quantity`}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <Button
                              className="h-11 rounded-full px-5 text-xs uppercase tracking-[0.24em]"
                              onClick={() => addToCart(product.id)}
                            >
                              Add to Order
                            </Button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="hidden xl:block xl:sticky xl:top-28">
              <OrderSummary
                cartItems={cartItems}
                checkoutError={checkoutError}
                isCheckingOut={isCheckingOut}
                products={products}
                onCheckout={handleCheckout}
                onUpdateQuantity={setProductQuantity}
              />
            </div>
          </div>
        </section>

        <section className="border-t border-primary/10 bg-[#fbf7f3]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-20">
            <div>
              <p className="luxury-subheading text-foreground/55">Checkout Notes</p>
              <h2 className="mt-3 max-w-lg text-4xl leading-none md:text-5xl">
                One payment flow, then a personal follow-up.
              </h2>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="rounded-[1.75rem] border border-primary/10 bg-white/80 p-5">
                  <Clock3 className="h-5 w-5 text-[hsl(var(--rose-gold))]" />
                  <p className="mt-4 text-lg">Purchase now, schedule after</p>
                  <p className="mt-2 text-sm leading-7 text-foreground/68">
                    These are treatment packages, so payment secures the package while appointment
                    times are arranged with the clinic team after checkout.
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-primary/10 bg-white/80 p-5">
                  <Gift className="h-5 w-5 text-[hsl(var(--rose-gold))]" />
                  <p className="mt-4 text-lg">Gift-ready options included</p>
                  <p className="mt-2 text-sm leading-7 text-foreground/68">
                    Voucher purchases can sit beside treatment packages in the same order and still
                    move through the same secure checkout.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-primary/10 bg-primary p-8 text-primary-foreground">
              <p className="luxury-subheading text-primary-foreground/60">Need a Human Recommendation?</p>
              <h3 className="mt-3 text-3xl leading-none">Let the concierge choose the right package mix for you.</h3>
              <p className="mt-4 text-sm leading-7 text-primary-foreground/72">
                If you are deciding between a facial plan, lash maintenance, or a more complete pre-event programme,
                send us your goal and timeline first.
              </p>
              <a
                href={conciergeWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-5 py-3 text-xs uppercase tracking-[0.24em] text-primary transition hover:bg-primary-foreground/90"
              >
                Start WhatsApp Consultation
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <div className="fixed inset-x-0 bottom-4 z-40 px-4 xl:hidden">
          <SheetTrigger asChild>
            <Button className="mx-auto flex h-[52px] w-full max-w-md items-center justify-between rounded-full bg-primary px-5 text-primary-foreground shadow-[0_18px_50px_-24px_rgba(0,0,0,0.75)]">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em]">
                <ShoppingBag className="h-4 w-4" />
                View Order
              </span>
              <span className="text-sm">{itemCount} items</span>
            </Button>
          </SheetTrigger>
        </div>
        <SheetContent
          side="bottom"
          className="max-h-[88svh] overflow-y-auto rounded-t-[2rem] border-none bg-transparent p-0 shadow-none"
        >
          <div className="rounded-t-[2rem] bg-transparent px-4 pb-4 pt-8">
            <SheetHeader className="sr-only">
              <SheetTitle>Order summary</SheetTitle>
              <SheetDescription>Review your package order and continue to Stripe checkout.</SheetDescription>
            </SheetHeader>
            <div className="mx-auto max-w-md">
              <OrderSummary
                cartItems={cartItems}
                checkoutError={checkoutError}
                isCheckingOut={isCheckingOut}
                products={products}
                onCheckout={handleCheckout}
                onUpdateQuantity={setProductQuantity}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Store;
