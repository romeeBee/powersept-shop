import { useMemo } from "react";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useContent } from "@/content/store";
import { Seo } from "@/components/site/Seo";
import { AdminHeading, StatTile } from "@/admin/ui";
import { formatDateShort, wordCount } from "@/lib/content-utils";

function cadence(dates: string[]) {
  const months: { key: string; label: string; count: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    months.push({
      key,
      label: new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" }).format(date),
      count: 0,
    });
  }
  const index = new Map(months.map((month) => [month.key, month]));
  for (const date of dates) {
    const month = index.get(date.slice(0, 7));
    if (month) month.count += 1;
  }
  return months;
}

export default function Dashboard() {
  const { articles, authors, categories, published, isModified } = useContent();

  const drafts = articles.filter((article) => article.status === "draft");
  const words = published.reduce((total, article) => total + wordCount(article.body), 0);
  const data = useMemo(() => cadence(published.map((a) => a.publishedAt)), [published]);
  const peak = Math.max(...data.map((month) => month.count), 0);

  return (
    <>
      <Seo title="Dashboard" description="Editorial dashboard" path="/admin" noindex />

      <AdminHeading
        title="Dashboard"
        action={
          <Link
            to="/admin/articles/new"
            className="inline-flex items-center gap-2 rounded-full bg-signal px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            New article
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatTile label="Published" value={published.length} />
        <StatTile label="Drafts" value={drafts.length} />
        <StatTile label="Writers" value={authors.length} />
        <StatTile label="Topics" value={categories.length} />
        <StatTile label="Words published" value={words.toLocaleString("en-GB")} />
      </div>

      <section className="mt-6 rounded-lg border border-rule bg-background p-6">
        <h2 className="text-sm font-medium">Articles published per month</h2>
        <div className="mt-6 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -24 }} barCategoryGap="28%">
              <CartesianGrid vertical={false} stroke="var(--rule)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: "var(--rule)" }}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                allowDecimals={false}
                width={44}
                tickLine={false}
                axisLine={false}
                domain={[0, Math.max(peak, 1)]}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--popover-foreground)",
                }}
                labelStyle={{ color: "var(--muted-foreground)" }}
                formatter={(value: number) => [value, "articles"]}
              />
              <Bar dataKey="count" fill="var(--signal)" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-rule bg-background p-6">
          <h2 className="text-sm font-medium">In draft</h2>
          <ul className="mt-4 divide-y divide-rule">
            {drafts.map((article) => (
              <li key={article.slug} className="py-3">
                <Link
                  to={`/admin/articles/${article.slug}`}
                  className="flex items-baseline justify-between gap-4 transition-colors hover:text-signal"
                >
                  <span className="truncate font-display text-lg">{article.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDateShort(article.publishedAt)}
                  </span>
                </Link>
              </li>
            ))}
            {drafts.length === 0 && (
              <li className="py-3 text-sm text-muted-foreground">Nothing in draft.</li>
            )}
          </ul>
        </section>

        <section className="rounded-lg border border-rule bg-background p-6">
          <h2 className="text-sm font-medium">Recently published</h2>
          <ul className="mt-4 divide-y divide-rule">
            {published.slice(0, 5).map((article) => (
              <li key={article.slug} className="py-3">
                <Link
                  to={`/admin/articles/${article.slug}`}
                  className="flex items-baseline justify-between gap-4 transition-colors hover:text-signal"
                >
                  <span className="truncate font-display text-lg">{article.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDateShort(article.publishedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted-foreground">
        {isModified
          ? "Edits are stored in this browser. Use Export content to write them back into src/content/data.ts so they ship with the build."
          : "The magazine is running on the sample articles in src/content/data.ts. Edits you make here are stored in this browser until you export them."}
      </p>
    </>
  );
}
