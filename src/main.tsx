import "@vly-ai/integrations";
import React, { StrictMode, Suspense, lazy, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { Toaster } from "@/components/ui/sonner";
import { ContentProvider } from "@/content/store";
import { SiteLayout } from "@/components/site/SiteLayout";
import "./index.css";

const Home = lazy(() => import("./pages/Home.tsx"));
const ArticlePage = lazy(() => import("./pages/ArticlePage.tsx"));
const Topic = lazy(() => import("./pages/Topic.tsx"));
const Writers = lazy(() => import("./pages/Writers.tsx"));
const Author = lazy(() => import("./pages/Author.tsx"));
const Archive = lazy(() => import("./pages/Archive.tsx"));
const Search = lazy(() => import("./pages/Search.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const AdminLayout = lazy(() =>
  import("./admin/AdminLayout.tsx").then((m) => ({ default: m.AdminLayout })),
);
const Dashboard = lazy(() => import("./pages/admin/Dashboard.tsx"));
const ArticlesAdmin = lazy(() => import("./pages/admin/ArticlesAdmin.tsx"));
const ArticleEditor = lazy(() => import("./pages/admin/ArticleEditor.tsx"));
const WritersAdmin = lazy(() => import("./pages/admin/WritersAdmin.tsx"));
const TopicsAdmin = lazy(() => import("./pages/admin/TopicsAdmin.tsx"));
const SettingsAdmin = lazy(() => import("./pages/admin/SettingsAdmin.tsx"));

function RouteLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <span className="kicker animate-pulse text-muted-foreground">Loading</span>
    </div>
  );
}

/** Silent error boundary — a toolbar crash must not take the page with it. */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] disabled after error:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so a runtime error never leaves a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  state = { hasError: false, message: "" };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message || "Unknown runtime error" };
  }
  componentDidCatch(err: Error) {
    console.error("[SIGNAL] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
          <div className="max-w-lg text-center">
            <p className="kicker text-signal">Runtime error</p>
            <p className="mt-3 text-sm text-muted-foreground">{this.state.message}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
      <ContentProvider>
        <BrowserRouter>
          <RouteSyncer />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/article/:slug" element={<ArticlePage />} />
                <Route path="/topic/:slug" element={<Topic />} />
                <Route path="/writers" element={<Writers />} />
                <Route path="/author/:slug" element={<Author />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/search" element={<Search />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="articles" element={<ArticlesAdmin />} />
                <Route path="articles/new" element={<ArticleEditor />} />
                <Route path="articles/:slug" element={<ArticleEditor />} />
                <Route path="writers" element={<WritersAdmin />} />
                <Route path="topics" element={<TopicsAdmin />} />
                <Route path="settings" element={<SettingsAdmin />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster position="bottom-right" />
      </ContentProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
