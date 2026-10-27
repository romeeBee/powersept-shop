import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Lock } from "lucide-react";
import { Wordmark } from "@/components/site/Wordmark";
import { Seo } from "@/components/site/Seo";

export function AdminLogin({ onSubmit }: { onSubmit: (passphrase: string) => boolean }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!onSubmit(value)) {
      setError(true);
      setValue("");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <Seo title="Editor" description="Editorial admin" path="/admin" noindex />

      <Link to="/" className="mb-10">
        <Wordmark className="text-3xl" />
      </Link>

      <form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-rule bg-card p-8">
        <div className="flex items-center gap-2 text-signal">
          <Lock className="size-4" />
          <h1 className="kicker">Editor access</h1>
        </div>

        <input
          type="password"
          autoFocus
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setError(false);
          }}
          placeholder="Passphrase"
          className="mt-6 w-full border-b border-input bg-transparent py-2 outline-none focus:border-signal"
        />
        {error && <p className="mt-2 text-sm text-destructive">That passphrase is wrong.</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-signal py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Open the editor
        </button>

        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          Default passphrase <code className="font-mono text-foreground">signal</code>. This gate
          runs in the browser and keeps the editor out of a reader's way. It is not
          authentication, so do not put anything private behind it.
        </p>
      </form>

      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-signal"
      >
        <ArrowLeft className="size-4" />
        Back to the magazine
      </Link>
    </div>
  );
}
