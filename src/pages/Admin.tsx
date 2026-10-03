import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { formatDate, formatPrice, glsTrackingUrl, orderStatusLabel, orderStatusTone } from "@/lib/shop";
import { cn } from "@/lib/utils";
import {
  Download,
  Lock,
  PackageCheck,
  ReceiptText,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

type OrderWithItems = Doc<"orders"> & { items: Array<Doc<"orderItems">> };

const STATUSES = [
  "prejeto",
  "caka_placilo",
  "placano",
  "v_obdelavi",
  "poslano",
  "dostavljeno",
  "stornirano",
  "zavraceno",
] as const;

export default function Admin() {
  const state = useQuery(api.orders.adminState);
  const orders = useQuery(api.orders.listAllOrders) as OrderWithItems[] | undefined;
  const stats = useQuery(api.orders.adminStats);
  const messages = useQuery(api.contact.list);
  const claimAdmin = useMutation(api.orders.claimAdmin);
  const updateStatus = useMutation(api.orders.updateOrderStatus);
  const createShipment = useAction(api.gls.createShipment);
  const [busyId, setBusyId] = useState<string | null>(null);

  if (state === undefined) {
    return (
      <main className="container-page py-20 text-center">
        <div className="mx-auto size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  if (!state.isAdmin) {
    return (
      <main className="container-page py-20">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
            <Lock className="size-7 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">Nadzorna plošča trgovine</h1>
          <p className="text-muted-foreground">
            {state.hasAdmin
              ? "Dostop je omejen na skrbnike trgovine. Prijavite se z računom skrbnika."
              : "Še ni določenega skrbnika. Prijavite se z e-poštnim računom in prevzemite vlogo skrbnika."}
          </p>
          {!state.hasAdmin && (
            <Button
              onClick={() => {
                claimAdmin({})
                  .then(() => toast.success("Postali ste skrbnik trgovine."))
                  .catch((error: unknown) =>
                    toast.error(error instanceof Error ? error.message : "Napaka."),
                  );
              }}
            >
              Postani skrbnik
            </Button>
          )}
        </div>
      </main>
    );
  }

  const allOrders = orders ?? [];

  async function handleStatus(orderId: string, status: string) {
    setBusyId(orderId);
    try {
      await updateStatus({ orderId: orderId as never, status });
      toast.success(`Status posodobljen: ${orderStatusLabel(status)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Napaka pri posodabljanju.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleShipment(orderId: string) {
    setBusyId(orderId);
    try {
      const result = await createShipment({ orderId: orderId as never, markShipped: true });
      if (result.error) {
        toast.error(`GLS: ${result.error}`);
      } else {
        toast.success(
          result.mode === "demo"
            ? `Demo pošiljka ustvarjena (brez GLS poverilnic): ${result.trackingNumber}`
            : `GLS etiketa ustvarjena: ${result.trackingNumber}`,
        );
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "GLS napaka.");
    } finally {
      setBusyId(null);
    }
  }

  function downloadLabel(order: OrderWithItems) {
    const base64 = order.gls?.labelPdfBase64;
    if (!base64) {
      toast.error("Etiketa ni na voljo (demo način nima PDF etikete).");
      return;
    }
    const blob = new Blob([Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gls-${order.gls?.trackingNumber ?? order._id}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="container-page py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Nadzorna plošča</h1>
          <p className="mt-2 text-muted-foreground">Naročila, statusi in GLS pošiljke na enem mestu.</p>
        </div>
      </header>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ReceiptText}
          label="Naročila skupaj"
          value={String(stats?.orderCount ?? 0)}
        />
        <StatCard
          icon={PackageCheck}
          label="Odprta naročila"
          value={String(stats?.openOrders ?? 0)}
        />
        <StatCard
          icon={Wallet}
          label="Prihodek"
          value={formatPrice(stats?.revenue ?? 0)}
        />
        <StatCard
          icon={Users}
          label="Uporabniki"
          value={String(stats?.customerCount ?? 0)}
        />
      </div>

      {/* Orders */}
      <h2 className="mb-4 font-display text-xl font-bold">Naročila</h2>
      {allOrders.length === 0 ? (
        <p className="card-clinical p-6 text-muted-foreground">Ni še nobenih naročil.</p>
      ) : (
        <div className="space-y-4">
          {allOrders.map((order) => (
            <div key={order._id} className="card-clinical overflow-hidden">
              <div className="flex flex-wrap items-center gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    #{order._id.slice(-8).toUpperCase()} · {order.contact.name}
                    {order.contact.company ? ` (${order.contact.company})` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order._creationTime)} · {order.items.length} artiklov ·{" "}
                    {order.paymentMethod === "card" ? "Kartica" : "UPN"} ·{" "}
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                  </p>
                </div>
                <Badge className={orderStatusTone(order.status)}>{orderStatusLabel(order.status)}</Badge>
                <span className="font-bold">{formatPrice(order.total)}</span>
              </div>

              <div className="border-t bg-secondary/30 px-5 py-4">
                <div className="mb-3 space-y-1.5 text-sm">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex justify-between gap-3">
                      <span className="text-muted-foreground">
                        {item.productName} × {item.quantity}
                      </span>
                      <span className="font-medium">{formatPrice(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                  {order.note && (
                    <p className="rounded-lg bg-brand-coral-soft px-3 py-2 text-xs text-foreground">
                      Opomba: {order.note}
                    </p>
                  )}
                </div>

                <Separator className="my-3" />

                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleStatus(order._id, value)}
                    disabled={busyId === order._id}
                  >
                    <SelectTrigger className="h-9 w-[190px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {orderStatusLabel(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    size="sm"
                    className="gap-2"
                    disabled={busyId === order._id}
                    onClick={() => handleShipment(order._id)}
                  >
                    <Truck className="size-4" />
                    {busyId === order._id
                      ? "Pošiljanje…"
                      : order.gls?.trackingNumber
                        ? "Ponovno ustvari etiketo"
                        : "Ustvari GLS etiketo"}
                  </Button>

                  {order.gls?.labelPdfBase64 && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => downloadLabel(order)}
                    >
                      <Download className="size-4" />
                      PDF etiketa
                    </Button>
                  )}

                  {order.gls?.trackingNumber && (
                    <Button size="sm" variant="ghost" asChild>
                      <a
                        href={glsTrackingUrl(order.gls.trackingNumber)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs"
                      >
                        {order.gls.trackingNumber}
                      </a>
                    </Button>
                  )}
                </div>

                {order.gls?.error && (
                  <p className="mt-2 text-xs text-destructive">GLS napaka: {order.gls.error}</p>
                )}
                {order.gls?.mode === "demo" && !order.gls.error && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Demo način — v nastavitvah Convex dodajte GLS_CLIENT_NUMBER, GLS_USERNAME in GLS_PASSWORD za
                    prave etikete.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact messages */}
      {messages && messages.length > 0 && (
        <>
          <h2 className="mb-4 mt-10 font-display text-xl font-bold">Kontaktna sporočila</h2>
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message._id} className="card-clinical p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{message.subject}</p>
                  <span className="text-xs text-muted-foreground">{formatDate(message._creationTime)}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {message.name} · {message.email}
                  {message.phone ? ` · ${message.phone}` : ""}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm">{message.message}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ReceiptText;
  label: string;
  value: string;
}) {
  return (
    <div className="card-clinical flex items-center gap-4 p-5">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-teal-soft">
        <Icon className="size-5 text-brand-teal" />
      </div>
      <div className="min-w-0">
        <p className={cn("truncate font-display text-xl font-bold")}>{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
