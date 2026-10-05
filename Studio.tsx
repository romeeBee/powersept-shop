import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { STUDIO_BASE_PATH } from "@/lib/router-base";
import {
  SANITY_DATASET,
  SANITY_PROJECT_ID,
  SANITY_STUDIO_TITLE,
} from "@/sanity/config";
import { schemaTypes } from "@/sanity/schema";
import { ArrowRight, Database, Settings2 } from "lucide-react";
import { Studio, defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { useNavigate } from "react-router";

/** Built during render so an empty project ID never reaches the Studio. */
function createStudioConfig() {
  return defineConfig({
    name: "powersept",
    title: SANITY_STUDIO_TITLE,
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    basePath: STUDIO_BASE_PATH,
    plugins: [structureTool()],
    schema: { types: schemaTypes },
  });
}

function ConnectSanity() {
  const navigate = useNavigate();
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="bg-grid-soft absolute inset-0" aria-hidden />
      <div className="relative flex flex-1 items-center justify-center px-4 py-10">
        <Card className="w-full max-w-xl shadow-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
              <Database className="size-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl">
              Sanity Studio še ni povezan
            </CardTitle>
            <CardDescription>
              Potrebujemo samo Sanity Project ID — Studio se nato prikaže na
              tej strani.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <ol className="list-decimal space-y-3 pl-5 text-muted-foreground">
              <li>
                Ustvarite brezplačen račun na{" "}
                <a
                  className="font-medium text-primary underline underline-offset-2"
                  href="https://www.sanity.io/manage"
                  target="_blank"
                  rel="noreferrer"
                >
                  sanity.io/manage
                </a>{" "}
                in kliknite <strong>Create project</strong>.
              </li>
              <li>
                Kopirajte <strong>Project ID</strong> (npr.{" "}
                <code className="rounded bg-muted px-1 py-0.5">a1b2c3d4</code>).
              </li>
              <li>
                Povejte mi ga — vnesem ga v{" "}
                <strong>src/sanity/config.ts</strong> in samodejno se objavi na
                GitHubu.
              </li>
              <li>
                V Sanity (Project → API) dodajte <strong>CORS origin</strong>:{" "}
                <code className="rounded bg-muted px-1 py-0.5">
                  https://romeebee.github.io
                </code>{" "}
                in vklopite <strong>Authenticated requests</strong>.
              </li>
            </ol>
            <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
              <Settings2 className="mb-1 inline size-3.5" /> Podatkovni set:{" "}
              <strong>{SANITY_DATASET}</strong> · Pot:{" "}
              <strong>{STUDIO_BASE_PATH}</strong>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" onClick={() => navigate("/")}>
              Nazaj na trgovino
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

/**
 * Route: `/studio/*` — vgrajen Sanity Studio (CMS).
 *
 * Brez vnesenega Project ID prikaže navodila za povezavo, zato ruta nikoli
 * ne pade v 404.
 */
export default function StudioPage() {
  if (!SANITY_PROJECT_ID) {
    return <ConnectSanity />;
  }
  return (
    <div className="h-screen max-h-screen w-full overflow-auto overscroll-none [-webkit-font-smoothing:antialiased]">
      <Studio config={createStudioConfig()} />
    </div>
  );
}
