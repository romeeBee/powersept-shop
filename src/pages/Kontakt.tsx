import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useMutation } from "convex/react";
import { toast } from "sonner";

export default function Kontakt() {
  const send = useMutation(api.contact.send);
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    const formData = new FormData(event.currentTarget);
    try {
      await send({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? "") || undefined,
        subject: String(formData.get("subject") ?? ""),
        message: String(formData.get("message") ?? ""),
      });
      toast.success("Sporočilo je poslano. Odgovorimo v 1 delovnem dnevu.");
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Pošiljanje ni uspelo.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="container-page py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="card-clinical p-6 sm:p-8">
          <h1 className="font-display text-3xl font-bold">Kontakt</h1>
          <p className="mt-2 text-muted-foreground">
            Imate vprašanje o izdelkih, naročilu ali sodelovanju? Pišite nam in odgovorimo v 1 delovnem dnevu.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Ime in priimek *</Label>
                <Input id="name" name="name" placeholder="Ana Novak" required minLength={2} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">E-pošta *</Label>
                <Input id="email" name="email" type="email" placeholder="ana@podjetje.si" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Telefon (neobvezno)</Label>
                <Input id="phone" name="phone" placeholder="+386 40 123 456" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Zadeva *</Label>
                <Input id="subject" name="subject" placeholder="Vprašanje o izdelku" required minLength={2} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Sporočilo *</Label>
              <Textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Kako vam lahko pomagamo?"
                required
                minLength={10}
              />
            </div>
            <Button type="submit" disabled={isSending} className="w-full sm:w-auto">
              {isSending ? "Pošiljanje…" : "Pošlji sporočilo"}
            </Button>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="card-clinical space-y-4 p-6">
            <h2 className="font-display text-lg font-bold">Podatki podjetja</h2>
            <p className="flex items-start gap-3 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-teal" />
              Powersept d.o.o.
              <br />
              Cesta na Brdo 1, 1000 Ljubljana
            </p>
            <p className="flex items-center gap-3 text-sm text-muted-foreground">
              <Mail className="size-4 shrink-0 text-brand-teal" />
              <a href="mailto:info@powersept.com" className="hover:text-foreground">
                info@powersept.com
              </a>
            </p>
            <p className="flex items-center gap-3 text-sm text-muted-foreground">
              <Phone className="size-4 shrink-0 text-brand-teal" />
              <a href="tel:+3861000000" className="hover:text-foreground">
                +386 1 000 00 00
              </a>
            </p>
            <p className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="size-4 shrink-0 text-brand-teal" />
              Ponedeljek–petek, 8.00–16.00
            </p>
          </div>

          <div className="card-clinical p-6">
            <h2 className="font-display text-lg font-bold">Hitra vprašanja</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="hover:text-foreground" to="/dostava">
                  Dostava in vračila
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" to="/placila">
                  Načini plačila
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" to="/pogoji">
                  Pogoji poslovanja
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
