import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import {
  ArrowUpRight,
  Download,
  FileText,
  Gauge,
  LogOut,
  Moon,
  Sun,
  Tags,
  Users,
  Settings as SettingsIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminSession } from "./session";
import { AdminLogin } from "./AdminLogin";
import { Wordmark } from "@/components/site/Wordmark";
import { useContent } from "@/content/store";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Dashboard", Icon: Gauge, end: true },
  { to: "/admin/articles", label: "Articles", Icon: FileText, end: false },
  { to: "/admin/writers", label: "Writers", Icon: Users, end: false },
  { to: "/admin/topics", label: "Topics", Icon: Tags, end: false },
  { to: "/admin/settings", label: "Settings", Icon: SettingsIcon, end: false },
];

export function AdminLayout() {
  const { signedIn, signIn, signOut } = useAdminSession();
  const { site, categories, authors, articles } = useContent();
  const { dark, toggle } = useTheme();
  const [exporting, setExporting] = useState(false);

  if (!signedIn) return <AdminLogin onSubmit={signIn} />;

  function exportContent() {
    setExporting(true);
    const payload = JSON.stringify({ site, categories, authors, articles }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "signal-content.json";
    link.click();
    URL.revokeObjectURL(url);
    setExporting(false);
    toast.success("Content exported", {
      description: "Paste it into src/content/data.ts to ship it.",
    });
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto flex max-w-[100rem] flex-col lg:flex-row">
        <aside className="shrink-0 border-b border-rule bg-background lg:h-screen lg:w-64 lg:sticky lg:top-0 lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between px-6 py-6">
            <Link to="/">
              <Wordmark className="text-2xl" />
            </Link>
            <span className="kicker text-muted-foreground">Editor</span>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0">
            {NAV.map(({ to, label, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-signal/10 font-medium text-signal"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto hidden flex-col gap-1 p-3 lg:flex lg:absolute lg:bottom-0 lg:w-64">
            <button
              type="button"
              onClick={exportContent}
              disabled={exporting}
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Download className="size-4" />
              Export content
            </button>
            <button
              type="button"
              onClick={toggle}
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {dark ? "Light theme" : "Dark theme"}
            </button>
            <Link
              to="/"
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowUpRight className="size-4" />
              View site
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <Outlet />
          <div className="mt-10 flex gap-2 lg:hidden">
            <button
              type="button"
              onClick={exportContent}
              className="rounded-md border border-rule px-3 py-2 text-sm"
            >
              Export content
            </button>
            <button
              type="button"
              onClick={signOut}
              className="rounded-md border border-rule px-3 py-2 text-sm"
            >
              Sign out
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
