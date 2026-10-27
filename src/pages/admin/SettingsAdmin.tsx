import { useState } from "react";
import { toast } from "sonner";
import { useContent } from "@/content/store";
import { Seo } from "@/components/site/Seo";
import { AdminHeading, Field, GhostButton, PrimaryButton, inputClass } from "@/admin/ui";
import { setAdminPassphrase } from "@/admin/session";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsAdmin() {
  const { site, saveSite, resetContent } = useContent();
  const [draft, setDraft] = useState(site);
  const [passphrase, setPassphrase] = useState("");

  return (
    <>
      <Seo title="Settings" description="Site settings" path="/admin/settings" noindex />
      <AdminHeading title="Settings" />

      <div className="grid max-w-3xl gap-6">
        <section className="rounded-lg border border-rule bg-background p-6">
          <h2 className="text-sm font-medium">Masthead</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Tagline">
              <input
                value={draft.tagline}
                onChange={(event) => setDraft({ ...draft, tagline: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Description" className="sm:col-span-2" hint="Used as the default meta description.">
              <textarea
                rows={2}
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                className={cn(inputClass, "resize-y")}
              />
            </Field>
            <Field label="Site URL" hint="Canonical origin for sitemap, RSS and meta tags.">
              <input
                value={draft.url}
                onChange={(event) => setDraft({ ...draft, url: event.target.value })}
                className={cn(inputClass, "font-mono text-xs")}
              />
            </Field>
            <Field label="Locale">
              <input
                value={draft.locale}
                onChange={(event) => setDraft({ ...draft, locale: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Publishing since">
              <input
                value={draft.founded}
                onChange={(event) => setDraft({ ...draft, founded: event.target.value })}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="mt-6">
            <PrimaryButton
              type="button"
              onClick={() => {
                saveSite(draft);
                toast.success("Settings saved");
              }}
            >
              Save settings
            </PrimaryButton>
          </div>
        </section>

        <section className="rounded-lg border border-rule bg-background p-6">
          <h2 className="text-sm font-medium">Editor passphrase</h2>
          <div className="mt-5 flex flex-wrap items-end gap-3">
            <Field label="New passphrase" className="max-w-xs flex-1">
              <input
                type="password"
                value={passphrase}
                onChange={(event) => setPassphrase(event.target.value)}
                className={inputClass}
              />
            </Field>
            <PrimaryButton
              type="button"
              onClick={() => {
                if (passphrase.length < 4) {
                  toast.error("Use at least four characters.");
                  return;
                }
                setAdminPassphrase(passphrase);
                setPassphrase("");
                toast.success("Passphrase updated");
              }}
            >
              Update
            </PrimaryButton>
          </div>
          <p className="mt-4 max-w-xl text-xs leading-relaxed text-muted-foreground">
            The passphrase is stored in this browser and checked in the browser. It hides the
            editor from readers; it does not protect anything.
          </p>
        </section>

        <section className="rounded-lg border border-rule bg-background p-6">
          <h2 className="text-sm font-medium">Local content</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Edits live in this browser until they are exported into src/content/data.ts. Resetting
            discards them and restores the content that ships with the build.
          </p>
          <div className="mt-5">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <GhostButton type="button" className="hover:border-destructive hover:text-destructive">
                  Reset to published content
                </GhostButton>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Discard local edits?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Every article, writer and topic change made in this browser is removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep editing</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      resetContent();
                      setDraft(site);
                      toast.success("Local edits discarded");
                    }}
                  >
                    Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      </div>
    </>
  );
}
