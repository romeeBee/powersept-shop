import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, formatPrice, glsTrackingUrl, orderStatusLabel, orderStatusTone } from "@/lib/shop";
import { cn } from "@/lib/utils";
import { ChevronDown, PackageOpen, ReceiptText, Truck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "convex/react";
import type { Doc, Id } from "@/convex/_generated/dataModel";

type OrderWithItems = Doc<"orders"> & { items: Array<Doc<"orderItems">> };

export default function Narocila() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const orders = useQuery(api.orders.listMyOrders) as OrderWithItems[] | undefined;
  const [openOrderId, setOpenOrderId] = useState<Id<"orders"> | null>(null);

  if (authLoading || orders === undefined) {
    return (
      <main className="container-page py-20 text-center">
        <div className="mx-auto size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="container-page py-20">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
            <PackageOpen className="size-7 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">Ni še naročil</h1>
          <p className="text-muted-foreground">
            Ko oddate prvo naročilo, se bo prikazalo tukaj skupaj s statusom in podrobnostmi.
          </p>
          <Button asChild size="lg" className="mt-2">
            <Link to="/trgovina">Raziskuj trgovino</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container-page py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold">Moja naročila</h1>
        <p className="mt-2 text-muted-foreground">
          Pregled vseh vaših naročil, statusov in računov.
        </p>
      </header>

      <div className="space-y-4">
        {orders.map((order) => {
          const isOpen = openOrderId === order._id;
          const statusLabel = orderStatusLabel(order.status);
          const tone = orderStatusTone(order.status);
          return (
            <div key={order._id} className="card-clinical overflow-hidden">
              <button
                className="flex w-full flex-wrap items-center gap-4 p-5 text-left transition-colors hover:bg-secondary/40"
                onClick={() => setOpenOrderId(isOpen ? null : order._id)}
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-teal-soft">
                  <ReceiptText className="size-5 text-brand-teal" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    Naročilo #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order._creationTime)} · {order.items.length}{" "}
                    {order.items.length === 1 ? "izdelek" : "izdelkov"} ·{" "}
                    {order.paymentMethod === "card" ? "Kartica" : "UPN"}
                  </p>
                </div>
                <Badge className={tone}>{statusLabel}</Badge>
                <span className="font-bold">{formatPrice(order.total)}</span>
                <ChevronDown
                  className={cn(isOpen ? "rotate-180" : "", "size-4 text-muted-foreground transition-transform")}
                />
              </button>

              {isOpen && (
                <div className="border-t px-5 py-4">
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex items-center justify-between gap-3 text-sm">
                        <span>
                          <span className="font-medium">{item.productName}</span>
                          <span className="text-muted-foreground">
                            {" "}· {item.quantity} × {formatPrice(item.unitPrice)}
                          </span>
                        </span>
                        <span className="font-semibold">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <h3 className="font-semibold">Dostava</h3>
                      <p className="mt-1 text-muted-foreground">
                        {order.contact.name}
                        <br />
                        {order.shippingAddress.street}
                        <br />
                        {order.shippingAddress.postalCode} {order.shippingAddress.city}
                        <br />
                        {order.shippingAddress.country}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Plačilo</h3>
                      <p className="mt-1 text-muted-foreground">
                        {order.paymentMethod === "card" ? "Plačilo po kartici" : "UPN po e-bančništvu"}
                        {order.upnReference && order.paymentMethod === "upn" && (
                          <>
                            <br />
                            Referenca: <span className="font-medium text-foreground">{order.upnReference}</span>
                          </>
                        )}
                      </p>
                      <p className="mt-3 text-muted-foreground">
                        Vmesna vsota: {formatPrice(order.subtotal)}
                        <br />
                        Dostava: {order.shipping === 0 ? "brezplačna" : formatPrice(order.shipping)}
                      </p>
                    </div>
                  </div>

                  {/* GLS shipment tracking */}
                  {order.gls?.trackingNumber && (
                    <>
                      <Separator className="my-4" />
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-teal-soft/60 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-lg bg-brand-teal text-white">
                            <Truck className="size-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">GLS dostava</p>
                            <p className="text-xs text-muted-foreground">
                              Št. pošiljke <span className="font-mono font-medium text-foreground">{order.gls.trackingNumber}</span>
                              {order.gls.mode === "demo" && " (demo način)"}
                            </p>
                          </div>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <a
                            href={glsTrackingUrl(order.gls.trackingNumber)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Sledi pošiljki
                          </a>
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Status history timeline */}
                  {order.statusHistory && order.statusHistory.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <h3 className="mb-3 font-semibold">Potek naročila</h3>
                      <ol className="space-y-3">
                        {[...order.statusHistory].reverse().map((entry, index) => (
                          <li key={`${entry.status}-${entry.at}-${index}`} className="flex gap-3 text-sm">
                            <span
                              className={cn(
                                "mt-1 size-2.5 shrink-0 rounded-full",
                                index === 0 ? "bg-brand-teal" : "bg-border",
                              )}
                            />
                            <span>
                              <span className="font-medium">{orderStatusLabel(entry.status)}</span>
                              <span className="text-muted-foreground"> · {formatDate(entry.at)}</span>
                              {entry.note && (
                                <span className="block text-xs text-muted-foreground">{entry.note}</span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

