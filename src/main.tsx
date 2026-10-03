import { Studio } from 'sanity';
import sanityConfig from '../sanity.config';
import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const ShopLayout = lazy(() => import("./components/shop/ShopLayout.tsx"));
const Trgovina = lazy(() => import("./pages/Trgovina.tsx"));
const Izdelek = lazy(() => import("./pages/Izdelek.tsx"));
const Kosarica = lazy(() => import("./pages/Kosarica.tsx"));
const Blagajna = lazy(() => import("./pages/Blagajna.tsx"));
const SeznamZelja = lazy(() => import("./pages/SeznamZelja.tsx"));
const Narocila = lazy(() => import("./pages/Narocila.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const Dostava = lazy(() => import("./pages/Dostava.tsx"));
const Placila = lazy(() => import("./pages/Placila.tsx"));
const Pogoji = lazy(() => import("./pages/Pogoji.tsx"));
const Zasebnost = lazy(() => import("./pages/Zasebnost.tsx"));
const Kontakt = lazy(() => import("./pages/Kontakt.tsx"));
const ONas = lazy(() => import("./pages/ONas.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Nalaganje…</div>
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in the browser runtime). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[Preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

// GitHub Pages serves the app from /PowerSept/, so the router must know the
// base path. In dev it is always "/".
const ROUTER_BASENAME = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "") || "/";



function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter basename={ROUTER_BASENAME}>
          <RouteSyncer />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              {/* Shop shell wraps every storefront route */}
              <Route element={<ShopLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/trgovina" element={<Trgovina />} />
                <Route path="/izdelek/:slug" element={<Izdelek />} />
                <Route path="/kosarica" element={<Kosarica />} />
                <Route
                  path="/blagajna"
                  element={
                    <RequireAuth
                      title="Zaključite nakup"
                      description="Za oddajo naročila se prijavite s svojim e-poštnim naslovom."
                    >
                      <Blagajna />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/seznam-zelja"
                  element={
                    <RequireAuth
                      title="Seznam želja"
                      description="Seznam želja je oseben — prijavite se za njegov ogled."
                    >
                      <SeznamZelja />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/narocila"
                  element={
                    <RequireAuth
                      title="Moja naročila"
                      description="Pregled naročil je na voljo prijavljenim uporabnikom."
                    >
                      <Narocila />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <RequireAuth
                      title="Nadzorna plošča"
                      description="Za dostop do upravljanja naročil se prijavite."
                    >
                      <Admin />
                    </RequireAuth>
                  }
                />
                {/* Info pages */}
                <Route path="/dostava" element={<Dostava />} />
                <Route path="/placila" element={<Placila />} />
                <Route path="/pogoji" element={<Pogoji />} />
                <Route path="/zasebnost" element={<Zasebnost />} />
                <Route path="/kontakt" element={<Kontakt />} />
                <Route path="/o-nas" element={<ONas />} />
              </Route>

              <Route
                path="/prijava"
                element={<AuthPage redirectAfterAuth="/trgovina" />}
              />
              <Route path="/studio/*" element={<Studio config={sanityConfig} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
