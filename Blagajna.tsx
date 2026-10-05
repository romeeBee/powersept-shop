import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-shop";
import { api } from "@/convex/_generated/api";
import { SHIPPING_FREE_THRESHOLD, formatPrice, productImages, shippingForSubtotal } from "@/lib/shop";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Landmark,
  Lock,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useMutation } from "convex/react";

type Step = 1 | 2 | 3;

const STEPS = [
  { id: 1, label: "Kontakt" },
  { id: 2, label: "Dostava" },
  { id: 3, label: "Plačilo" },
] as const;

export default function Blagajna() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { items, subtotal, isLoading: cartLoading } = useCart();
  const placeOrder = useMutation(api.orders.placeOrder);

  const [step, setStep] = useState<Step>(1);
  const [isPlacing, setIsPlacing] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  // Step 1: contact
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  // Step 2: shipping
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Slovenija");
  const [note, setNote] = useState("");

  // Step 3: payment
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upn">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

  const shipping = shippingForSubtotal(subtotal);
  const total = subtotal + shipping;
  const remaining = Math.max(0, SHIPPING_FREE_THRESHOLD - subtotal);

  if (!authLoading && !isAuthenticated) {
    navigate("/prijava?returnTo=%2Fblagajna", { replace: true });
    return null;
  }

  if (placedOrderId) {
    return (
      <main className="container-page flex min-h-[60vh] items-center justify-center py-16">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-brand-mint-soft">
            <CheckCircle2 className="size-8 text-brand-mint" />
          </div>
          <h1 className="font-display text-3xl font-bold">Hvala za vaše naročilo!</h1>
          <p className="text-muted-foreground">
            Naročilo je sprejeto. Potrdilo smo poslali na {email || "vaš e-poštni naslov"}.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/narocila">Moja naročila</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/trgovina">Nadaljuj z nakupom</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (!cartLoading && items.length === 0) {
    return (
      <main className="container-page py-20 text-center">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
            <ShoppingBag className="size-7 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">Košarica je prazna</h1>
          <p className="text-muted-foreground">Za blagajno dodajte izdelke v košarico.</p>
          <Button asChild>
            <Link to="/trgovina">Raziskuj trgovino</Link>
          </Button>
        </div>
      </main>
    );
  }

  const canContinueStep1 = name.trim() !== "" && /.+@.+\..+/.test(email) && phone.trim() !== "";
  const canContinueStep2 = street.trim() !== "" && city.trim() !== "" && postalCode.trim() !== "";

  const cardLooksValid =
    cardNumber.replace(/\s/g, "").length >= 12 &&
    /^\d{2}\/\d{2}$/.test(cardExpiry) &&
    cardCvc.length >= 3;

  async function handlePlaceOrder() {
    setIsPlacing(true);
    try {
      const result = await placeOrder({
        contact: { name: name.trim(), email: email.trim(), phone: phone.trim(), company: company.trim() || undefined },
        shippingAddress: { street: street.trim(), city: city.trim(), postalCode: postalCode.trim(), country },
        paymentMethod,
        note: note.trim() || undefined,
      });
      setPlacedOrderId(String(result.orderId));
      toast.success("Naročilo uspešno sprejeto.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Napaka pri naročilu.");
    } finally {
      setIsPlacing(false);
    }
  }

  return (
    <main className="container-page py-10">
      <h1 className="mb-6 font-display text-3xl font-bold">Blagajna</h1>

      {/* Stepper */}
      <ol className="mb-8 flex items-center gap-2 text-sm">
        {STEPS.map((s, index) => (
          <li key={s.id} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full border text-xs font-bold transition-colors",
                step > s.id
                  ? "border-brand-mint bg-brand-mint text-white"
                  : step === s.id
                    ? "border-brand-teal bg-brand-teal text-white"
                    : "border-border bg-card text-muted-foreground",
              )}
            >
              {step > s.id ? <CheckCircle2 className="size-4" /> : s.id}
            </span>
            <span className={cn("font-medium", step === s.id ? "text-foreground" : "text-muted-foreground")}>
              {s.label}
            </span>
            {index < STEPS.length - 1 && <span className="mx-2 h-px w-8 bg-border" />}
          </li>
        ))}
      </ol>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="card-clinical p-6">
          {/* STEP 1: Contact */}
          {step === 1 && (
            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold">Kontaktni podatki</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Ime in priimek *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ana Novak" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-pošta *</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ana@podjetje.si" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+386 40 123 456" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company">Podjetje (neobvezno)</Label>
                  <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Podjetje d.o.o." />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {user?.email ? `Prijavljeni ste kot ${user.email}. Podatke lahko po potrebi spremenite.` : "Prijavljeni ste kot gost."}
              </p>
              <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={() => navigate("/kosarica")} className="gap-2">
                  <ArrowLeft className="size-4" /> Nazaj na košarico
                </Button>
                <Button disabled={!canContinueStep1} onClick={() => setStep(2)} className="gap-2">
                  Naprej na dostavo <ArrowRight className="size-4" />
                </Button>
              </div>
            </section>
          )}

          {/* STEP 2: Shipping */}
          {step === 2 && (
            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold">Naslov dostave</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="street">Ulica in hišna številka *</Label>
                  <Input id="street" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Slovenska cesta 1" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="postalCode">Poštna številka *</Label>
                  <Input id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="1000" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city">Kraj *</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ljubljana" required />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="country">Država</Label>
                  <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} disabled />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="note">Opomba k naročilu (neobvezno)</Label>
                  <Textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Npr. dostaviti dopoldne, interfon, želja glede embalaže…"
                    rows={3}
                  />
                </div>
              </div>
              <div className="rounded-xl border bg-secondary/40 p-4 text-sm text-muted-foreground">
                Dostavlja <span className="font-semibold text-foreground">GLS</span> — sledenje s številko pošiljke je na voljo v
                razdelku Moja naročila. Standardna dostava {formatPrice(shippingForSubtotal(subtotal))}, pri naročilih nad{" "}
                {formatPrice(SHIPPING_FREE_THRESHOLD)} brezplačna.
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={() => setStep(1)} className="gap-2">
                  <ArrowLeft className="size-4" /> Nazaj na kontakt
                </Button>
                <Button disabled={!canContinueStep2} onClick={() => setStep(3)} className="gap-2">
                  Naprej na plačilo <ArrowRight className="size-4" />
                </Button>
              </div>
            </section>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold">Način plačila</h2>
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "card" | "upn")}>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors hover:bg-secondary/50" htmlFor="pay-card">
                  <RadioGroupItem value="card" id="pay-card" className="mt-0.5" />
                  <div>
                    <span className="flex items-center gap-2 font-medium">
                      <CreditCard className="size-4 text-brand-teal" /> Plačilo po kartici
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Visa, Mastercard ali Maestro — takojšnja potrditev.
                    </p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors hover:bg-secondary/50" htmlFor="pay-upn">
                  <RadioGroupItem value="upn" id="pay-upn" className="mt-0.5" />
                  <div>
                    <span className="flex items-center gap-2 font-medium">
                      <Landmark className="size-4 text-brand-teal" /> UPN po e-bančništvu
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Po oddaji naročila prejmete UPN navodila za plačilo po e-pošti.
                    </p>
                  </div>
                </label>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="space-y-4 rounded-xl border bg-secondary/40 p-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="cardName">Ime na kartici</Label>
                    <Input id="cardName" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="ANA NOVAK" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cardNumber">Številka kartice</Label>
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                        const grouped = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
                        setCardNumber(grouped);
                      }}
                      placeholder="4242 4242 4242 4242"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="cardExpiry">Velja do (MM/LL)</Label>
                      <Input
                        id="cardExpiry"
                        value={cardExpiry}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                          const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
                          setCardExpiry(formatted);
                        }}
                        placeholder="12/28"
                        inputMode="numeric"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input
                        id="cardCvc"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="size-3" />
                    Demonstracijsko plačevanje — podatkov ne shranjujemo. Za resnično plačevanje povežite ponudnika, npr. Stripe.
                  </p>
                </div>
              )}

              {paymentMethod === "upn" && (
                <div className="rounded-xl border bg-secondary/40 p-4 text-sm text-muted-foreground">
                  Po oddaji naročila vam posredujemo UPN podrobnosti: referenco in znesek.
                  Blago odpošljemo, ko prejmemo plačilo.
                </div>
              )}

              <div className="flex flex-col items-end justify-between gap-2 pt-2 sm:flex-row">
                <Button variant="ghost" onClick={() => setStep(2)} className="gap-2 self-start">
                  <ArrowLeft className="size-4" /> Nazaj na dostavo
                </Button>
                <div className="flex flex-col items-end gap-1.5">
                  {paymentMethod === "card" && !cardLooksValid && !isPlacing && (
                    <p className="text-xs text-brand-coral-strong">
                      Izpolnite številko kartice, veljavnost (MM/LL) in CVC.
                    </p>
                  )}
                  <Button onClick={handlePlaceOrder} disabled={isPlacing || (paymentMethod === "card" && !cardLooksValid)}>
                    {isPlacing ? (
                      "Oddajanje naročila…"
                    ) : (
                      <span className="flex items-center gap-2">
                        Oddaj naročilo · {formatPrice(total)}
                        <ArrowRight className="size-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Summary sidebar */}
        <aside className="card-clinical h-fit space-y-4 p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-bold">Povzetek naročila</h2>
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {items.map((item) => (
              <div key={item._id} className="flex items-center gap-3 text-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                  {productImages[item.slug] ? (
                    <img src={productImages[item.slug]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ShoppingBag className="size-4 text-muted-foreground" />
                  )}
                </div>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.quantity} × {formatPrice(item.price)}
                  </span>
                </span>
                <span className="shrink-0 font-semibold">{formatPrice(item.lineTotal)}</span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vmesna vsota</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dostava</span>
              <span className="font-medium">
                {shipping === 0 ? "Brezplačna" : formatPrice(shipping)}
              </span>
            </div>
            {remaining > 0 && (
              <p className="rounded-lg bg-brand-coral-soft px-3 py-2 text-xs">
                Za brezplačno dostavo manjka še {formatPrice(remaining)}.
              </p>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Skupaj</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
