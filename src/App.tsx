import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import Store from "./pages/Store";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const SettingsIntegration = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Avoid loading the chatbot on the Admin panel
    if (pathname.startsWith("/admin")) {
      const elements = (window as any).__injected_elements__;
      if (Array.isArray(elements)) {
        elements.forEach((el) => {
          if (el && el.style) {
            el.style.display = "none";
          }
        });
      }
      return;
    }

    // Show injected elements if coming back from admin
    const elements = (window as any).__injected_elements__;
    if (Array.isArray(elements)) {
      elements.forEach((el) => {
        if (el && el.style) {
          el.style.display = "";
        }
      });
    }

    if ((window as any).__chatbot_injected__) {
      return;
    }

    const loadSettingsAndInject = async () => {
      try {
        const response = await fetch("/api/settings");
        if (!response.ok) return;

        const data = await response.json();
        const scriptCode = data.chatbotScript;

        if (scriptCode && scriptCode.trim()) {
          const parser = new DOMParser();
          const parsedDoc = parser.parseFromString(scriptCode, "text/html");
          const injectedList: HTMLElement[] = [];

          const injectNode = (node: Node, targetContainer: HTMLElement) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as HTMLElement;
              const tagName = el.tagName.toLowerCase();
              let newEl: HTMLElement;

              if (tagName === "script") {
                const scriptEl = document.createElement("script");
                Array.from(el.attributes).forEach((attr) => {
                  scriptEl.setAttribute(attr.name, attr.value);
                });
                scriptEl.text = el.innerHTML;
                newEl = scriptEl;
              } else if (tagName === "style") {
                const styleEl = document.createElement("style");
                styleEl.innerHTML = el.innerHTML;
                newEl = styleEl;
              } else {
                newEl = el.cloneNode(true) as HTMLElement;
              }

              targetContainer.appendChild(newEl);
              injectedList.push(newEl);
            }
          };

          parsedDoc.head.childNodes.forEach((node) => injectNode(node, document.head));
          parsedDoc.body.childNodes.forEach((node) => injectNode(node, document.body));

          (window as any).__chatbot_injected__ = true;
          (window as any).__injected_elements__ = injectedList;
        }
      } catch (err) {
        console.error("Error fetching or injecting chatbot script:", err);
      }
    };

    void loadSettingsAndInject();
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <SettingsIntegration />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/store" element={<Store />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
