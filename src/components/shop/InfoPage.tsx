import type { ReactNode } from "react";

/**
 * Shared shell for informational pages (delivery, payment, terms, …):
 * a bold header band plus a readable content column.
 */
export function InfoPage({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <main className="container-page py-10">
      <header className="mb-8 max-w-3xl">
        <h1 className="font-display text-3xl font-bold">{title}</h1>
        {lead && <p className="mt-3 text-muted-foreground">{lead}</p>}
      </header>
      <div className="max-w-3xl space-y-6">{children}</div>
    </main>
  );
}

export function InfoSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="card-clinical p-6">
      <h2 className="font-display text-lg font-bold">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
