import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { upload } from "@vercel/blob/client";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { productImageOptions, resolveProductImage } from "@/data/storeCatalog";
import type { ProductImageKey, StoreProductRecord } from "@/data/productTypes";

const tokenStorageKey = "beauskin-admin-token";

const emptyProduct = (): StoreProductRecord => ({
  id: `new-product-${Date.now()}`,
  name: "New Treatment Package",
  category: "Facials",
  description: "Describe the package, who it is for, and why clients should choose it.",
  tagline: "Short premium summary for the storefront.",
  price: 0,
  active: true,
  featured: false,
  popular: false,
  giftable: false,
  sortOrder: 100,
  duration: "1 visit",
  idealFor: "Describe the ideal client or use case.",
  includes: ["Treatment detail"],
  imageKey: "serviceFacial",
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const Field = ({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) => (
  <label className="block">
    <span className="luxury-subheading text-foreground/55">{label}</span>
    <div className="mt-2">{children}</div>
    {hint ? <span className="mt-1 block text-xs text-foreground/45">{hint}</span> : null}
  </label>
);

const inputClass =
  "w-full rounded-2xl border border-primary/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/5";

const Admin = () => {
  const [token, setToken] = useState(() => window.localStorage.getItem(tokenStorageKey) || "");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<StoreProductRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "settings">("products");
  const [chatbotScript, setChatbotScript] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");
  const [settingsError, setSettingsError] = useState("");

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) || products[0],
    [products, selectedId],
  );

  const loadProducts = useCallback(async (adminToken = token) => {
    if (!adminToken) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin-products", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to load products.");
      }

      setProducts(data.products);
      setSelectedId(data.products[0]?.id || "");
      setMessage(`Loaded products from ${data.source}.`);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load products.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const loadSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setChatbotScript(data.chatbotScript || "");
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  }, []);

  const saveSettings = async () => {
    setIsSavingSettings(true);
    setSettingsError("");
    setSettingsMessage("");

    try {
      const response = await fetch("/api/admin-settings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatbotScript }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to save settings.");
      }

      setSettingsMessage(data.message || "Settings saved successfully.");
    } catch (saveError) {
      setSettingsError(saveError instanceof Error ? saveError.message : "Unable to save settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  useEffect(() => {
    if (token) {
      void loadProducts(token);
      void loadSettings();
    }
  }, [loadProducts, loadSettings, token]);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data?.error || "Unable to log in.");
      }

      window.localStorage.setItem(tokenStorageKey, data.token);
      setToken(data.token);
      setPassword("");
      setMessage("Admin session started.");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to log in.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = (id: string, patch: Partial<StoreProductRecord>) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) => (product.id === id ? { ...product, ...patch } : product)),
    );
  };

  const addProduct = () => {
    const product = emptyProduct();

    setProducts((currentProducts) => [...currentProducts, product]);
    setSelectedId(product.id);
    setMessage("New product added. Fill in the details, then save changes.");
  };

  const duplicateProduct = () => {
    if (!selectedProduct) {
      return;
    }

    const duplicate = {
      ...selectedProduct,
      id: `${slugify(selectedProduct.name)}-${Date.now()}`,
      name: `${selectedProduct.name} Copy`,
      active: false,
    };

    setProducts((currentProducts) => [...currentProducts, duplicate]);
    setSelectedId(duplicate.id);
    setMessage("Product duplicated as inactive so you can review it before publishing.");
  };

  const deleteProduct = () => {
    if (!selectedProduct || !window.confirm(`Delete ${selectedProduct.name}?`)) {
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== selectedProduct.id),
    );
    setSelectedId(products.find((product) => product.id !== selectedProduct.id)?.id || "");
  };

  const saveProducts = async () => {
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin-products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to save products.");
      }

      setMessage(data.message || "Products saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save products.");
    } finally {
      setIsSaving(false);
    }
  };

  const uploadProductImage = async (file: File) => {
    if (!selectedProduct) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError("");
    setMessage("");

    try {
      const extension = file.name.split(".").pop() || "jpg";
      const blob = await upload(
        `products/${selectedProduct.id}/${Date.now()}.${extension}`,
        file,
        {
          access: "public",
          handleUploadUrl: "/api/admin-upload",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: ({ percentage }) => {
            setUploadProgress(percentage);
          },
        },
      );

      updateProduct(selectedProduct.id, {
        imageUrl: blob.url,
      });
      setMessage("Image uploaded. Save changes to publish this image URL to the store.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const logout = () => {
    window.localStorage.removeItem(tokenStorageKey);
    setToken("");
    setProducts([]);
    setSelectedId("");
    setMessage("");
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#f7f1eb]">
        <Header />
        <main className="mx-auto flex min-h-screen max-w-xl items-center px-6 pt-14">
          <form
            onSubmit={login}
            className="w-full rounded-[2rem] border border-primary/10 bg-[#fbf7f3] p-8 shadow-[0_30px_90px_-70px_rgba(0,0,0,0.8)]"
          >
            <p className="luxury-subheading text-foreground/55">Beauskin Admin</p>
            <h1 className="mt-3 text-4xl leading-none">Product CMS</h1>
            <p className="mt-4 text-sm leading-7 text-foreground/68">
              Log in to edit store products, pricing, categories, descriptions, visibility, and
              storefront merchandising.
            </p>
            <Field label="Admin password">
              <input
                className={inputClass}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>
            {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
            <Button className="mt-6 h-12 w-full rounded-full uppercase tracking-[0.24em]" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Enter CMS
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f1eb]">
      <Header />
      <main className="mx-auto max-w-7xl px-6 pb-14 pt-24">
        <div className="mb-8 flex gap-3 border-b border-primary/10 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`rounded-full px-6 py-2.5 text-sm font-medium tracking-wide transition ${
              activeTab === "products"
                ? "bg-primary text-primary-foreground shadow"
                : "bg-white/70 hover:bg-white text-foreground/80 border border-primary/5 hover:border-primary/20"
            }`}
          >
            Products Catalog
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`rounded-full px-6 py-2.5 text-sm font-medium tracking-wide transition ${
              activeTab === "settings"
                ? "bg-primary text-primary-foreground shadow"
                : "bg-white/70 hover:bg-white text-foreground/80 border border-primary/5 hover:border-primary/20"
            }`}
          >
            Integrations & Settings
          </button>
        </div>

        <div className="flex flex-col gap-5 border-b border-primary/10 pb-8 md:flex-row md:items-end md:justify-between">
          {activeTab === "products" ? (
            <div>
              <p className="luxury-subheading text-foreground/55">Custom CMS</p>
              <h1 className="mt-3 text-5xl leading-none">Store Products</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/68">
                Edit the product catalogue here. Saving writes the live product data to Vercel Blob,
                so the storefront can update without a code deploy.
              </p>
            </div>
          ) : (
            <div>
              <p className="luxury-subheading text-foreground/55">Integrations</p>
              <h1 className="mt-3 text-5xl leading-none">Global Site Settings</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/68">
                Configure global integrations such as live chatbots and analytics tracking snippets that inject into the head of your public storefront pages.
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {activeTab === "products" ? (
              <>
                <Button variant="outline" className="rounded-full" onClick={() => void loadProducts()}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Reload
                </Button>
                <Button variant="outline" className="rounded-full" onClick={logout}>
                  Log out
                </Button>
                <Button className="rounded-full" onClick={() => void saveProducts()} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="outline" className="rounded-full" onClick={logout}>
                Log out
              </Button>
            )}
          </div>
        </div>

        {message ? (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{message}</span>
          </div>
        ) : null}
        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        {activeTab === "products" ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[21rem_minmax(0,1fr)]">
            <aside className="rounded-[2rem] border border-primary/10 bg-[#fbf7f3] p-4 lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-between gap-3 px-2 pb-4">
              <div>
                <p className="luxury-subheading text-foreground/50">Catalogue</p>
                <p className="mt-1 text-sm text-foreground/60">{products.length} products</p>
              </div>
              <Button size="icon" className="rounded-full" onClick={addProduct} aria-label="Add product">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedId(product.id)}
                  className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                    selectedProduct?.id === product.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/70 text-foreground hover:bg-white"
                  }`}
                >
                  <span className="block text-sm font-medium">{product.name}</span>
                  <span
                    className={`mt-1 flex items-center gap-2 text-xs ${
                      selectedProduct?.id === product.id
                        ? "text-primary-foreground/65"
                        : "text-foreground/50"
                    }`}
                  >
                    {product.active === false ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {product.category} · S${product.price}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {selectedProduct ? (
            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
              <div className="rounded-[2rem] border border-primary/10 bg-[#fbf7f3] p-6 md:p-8">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="luxury-subheading text-foreground/50">Editing Product</p>
                    <h2 className="mt-2 text-4xl leading-none">{selectedProduct.name}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="rounded-full" onClick={duplicateProduct}>
                      <Copy className="h-4 w-4" />
                      Duplicate
                    </Button>
                    <Button variant="outline" className="rounded-full" onClick={deleteProduct}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <Field label="Product name">
                    <input
                      className={inputClass}
                      value={selectedProduct.name}
                      onChange={(event) => {
                        const name = event.target.value;
                        const nextId =
                          selectedProduct.id.startsWith("new-product-")
                            ? slugify(name) || selectedProduct.id
                            : selectedProduct.id;

                        updateProduct(selectedProduct.id, {
                          name,
                          id: nextId,
                        });
                        setSelectedId(nextId);
                      }}
                    />
                  </Field>
                  <Field label="Product ID" hint="Lowercase letters, numbers, and hyphens only. Keep stable after launch.">
                    <input
                      className={inputClass}
                      value={selectedProduct.id}
                      onChange={(event) => {
                        const nextId = slugify(event.target.value);
                        updateProduct(selectedProduct.id, { id: nextId });
                        setSelectedId(nextId);
                      }}
                    />
                  </Field>
                  <Field label="Category">
                    <select
                      className={inputClass}
                      value={selectedProduct.category}
                      onChange={(event) => updateProduct(selectedProduct.id, { category: event.target.value })}
                    >
                      <option>Facials</option>
                      <option>IPL Hair Removal</option>
                      <option>Lash Treatments</option>
                      <option>LPG Body</option>
                      <option>Gift Vouchers</option>
                    </select>
                  </Field>
                  <Field label="Price">
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      value={selectedProduct.price}
                      onChange={(event) =>
                        updateProduct(selectedProduct.id, { price: Number(event.target.value) })
                      }
                    />
                  </Field>
                  <Field label="Original price">
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      value={selectedProduct.originalPrice || ""}
                      onChange={(event) =>
                        updateProduct(selectedProduct.id, {
                          originalPrice: event.target.value ? Number(event.target.value) : undefined,
                        })
                      }
                    />
                  </Field>
                  <Field label="Sessions">
                    <input
                      className={inputClass}
                      type="number"
                      min="1"
                      value={selectedProduct.sessions || ""}
                      onChange={(event) =>
                        updateProduct(selectedProduct.id, {
                          sessions: event.target.value ? Number(event.target.value) : undefined,
                        })
                      }
                    />
                  </Field>
                  <Field label="Duration">
                    <input
                      className={inputClass}
                      value={selectedProduct.duration}
                      onChange={(event) => updateProduct(selectedProduct.id, { duration: event.target.value })}
                    />
                  </Field>
                  <Field label="Sort order">
                    <input
                      className={inputClass}
                      type="number"
                      value={selectedProduct.sortOrder || 0}
                      onChange={(event) =>
                        updateProduct(selectedProduct.id, { sortOrder: Number(event.target.value) })
                      }
                    />
                  </Field>
                </div>

                <div className="mt-5 grid gap-5">
                  <Field label="Tagline">
                    <input
                      className={inputClass}
                      value={selectedProduct.tagline}
                      onChange={(event) => updateProduct(selectedProduct.id, { tagline: event.target.value })}
                    />
                  </Field>
                  <Field label="Description">
                    <textarea
                      className={`${inputClass} min-h-28`}
                      value={selectedProduct.description}
                      onChange={(event) => updateProduct(selectedProduct.id, { description: event.target.value })}
                    />
                  </Field>
                  <Field label="Ideal for">
                    <input
                      className={inputClass}
                      value={selectedProduct.idealFor}
                      onChange={(event) => updateProduct(selectedProduct.id, { idealFor: event.target.value })}
                    />
                  </Field>
                  <Field label="Includes" hint="One line per bullet shown on the product card.">
                    <textarea
                      className={`${inputClass} min-h-32`}
                      value={selectedProduct.includes.join("\n")}
                      onChange={(event) =>
                        updateProduct(selectedProduct.id, {
                          includes: event.target.value
                            .split("\n")
                            .map((item) => item.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </Field>
                </div>

                <div className="mt-6 grid gap-4 rounded-[1.5rem] border border-primary/10 bg-white/65 p-5 md:grid-cols-4">
                  {(["active", "featured", "popular", "giftable"] as const).map((field) => (
                    <label key={field} className="flex items-center gap-3 text-sm capitalize text-foreground/72">
                      <input
                        type="checkbox"
                        checked={Boolean(selectedProduct[field])}
                        onChange={(event) => updateProduct(selectedProduct.id, { [field]: event.target.checked })}
                      />
                      {field}
                    </label>
                  ))}
                </div>
              </div>

              <aside className="rounded-[2rem] border border-primary/10 bg-[#fbf7f3] p-5 xl:sticky xl:top-24 xl:self-start">
                <p className="luxury-subheading text-foreground/50">Storefront Image</p>
                <div className="mt-4 overflow-hidden rounded-[1.5rem] bg-primary/5">
                  <img
                    src={resolveProductImage(selectedProduct)}
                    alt={selectedProduct.name}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <div className="mt-5 space-y-4">
                  <Field label="Upload image to Vercel Blob" hint="JPG, PNG, WebP, or GIF up to 8 MB. Save changes after upload.">
                    <input
                      className={`${inputClass} file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.2em] file:text-primary-foreground`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      disabled={isUploading}
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                          void uploadProductImage(file);
                        }

                        event.target.value = "";
                      }}
                    />
                    {isUploading ? (
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary/10">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    ) : null}
                  </Field>
                  <Field label="Existing image">
                    <select
                      className={inputClass}
                      value={selectedProduct.imageKey || "serviceFacial"}
                      onChange={(event) =>
                        updateProduct(selectedProduct.id, {
                          imageKey: event.target.value as ProductImageKey,
                          imageUrl: "",
                        })
                      }
                    >
                      {productImageOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="External image URL" hint="Optional. Paste a full image URL to override the selected image.">
                    <input
                      className={inputClass}
                      value={selectedProduct.imageUrl || ""}
                      onChange={(event) =>
                        updateProduct(selectedProduct.id, { imageUrl: event.target.value })
                      }
                    />
                  </Field>
                </div>
              </aside>
            </section>
          ) : (
            <section className="rounded-[2rem] border border-primary/10 bg-[#fbf7f3] p-10 text-center">
              <p className="text-foreground/65">No product selected. Add a product to begin.</p>
            </section>
          )}
        </div>
        ) : (
          <div className="mt-8 rounded-[2rem] border border-primary/10 bg-[#fbf7f3] p-6 md:p-8 max-w-4xl shadow-[0_30px_90px_-70px_rgba(0,0,0,0.8)] animate-fade-up">
            <p className="luxury-subheading text-foreground/50">Integrations Manager</p>
            <h2 className="mt-2 text-4xl font-serif mb-4 leading-none">Chatbot Script</h2>
            <p className="text-sm leading-7 text-foreground/68 mb-6">
              Paste the HTML/JavaScript embed code snippet provided by your chatbot service (e.g. Landbot, Intercom, LiveChat, custom widgets). 
              This script will be dynamically and safely injected right before the closing <code>&lt;/head&gt;</code> tag on every public page of your website.
            </p>
            
            <div className="space-y-6">
              <Field label="HTML Snippet / Embed Script" hint="Include all necessary <script> tags. Keep empty to disable chatbot.">
                <textarea
                  className={`${inputClass} min-h-64 font-mono text-xs leading-normal bg-white/70`}
                  placeholder="<!-- Paste your third-party script code here -->"
                  value={chatbotScript}
                  onChange={(e) => setChatbotScript(e.target.value)}
                />
              </Field>

              {settingsMessage ? (
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 animate-fade-in" />
                  <span>{settingsMessage}</span>
                </div>
              ) : null}
              {settingsError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 animate-fade-in">
                  {settingsError}
                </div>
              ) : null}

              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  className="rounded-full px-6 h-11" 
                  onClick={saveSettings} 
                  disabled={isSavingSettings}
                >
                  {isSavingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
