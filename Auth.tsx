import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import logo from "@/assets/powersept-logo.svg";
import { ArrowRight, Loader2, Mail, UserPlus, UserX } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/trgovina",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, user, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateProfile = useMutation(api.profile.updateProfile);

  // Guest (anonymous) sessions must not bounce the visitor away from the
  // sign-in form — only a real e-mail account counts as signed in here.
  const hasRealAccount = isAuthenticated === true && user?.isAnonymous !== true;

  useEffect(() => {
    if (!authLoading && hasRealAccount) {
      navigate(redirect);
    }
  }, [authLoading, hasRealAccount, navigate, redirect]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    if (mode === "register" && fullName.trim().length < 2) {
      setError("Vnesite ime in priimek.");
      setIsLoading(false);
      return;
    }
    try {
      await signIn("email-otp", formData);
      setStep({ email });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Pošiljanje kode ni uspelo. Poskusite znova.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      // New accounts keep the name collected on the register tab.
      if (mode === "register" && fullName.trim().length >= 2) {
        await updateProfile({ name: fullName.trim() }).catch(() => {
          // Profile saving must never block the sign-in itself.
        });
      }
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("Vpisana koda ni pravilna. Preverite in poskusite znova.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      setError(
        `Prijava kot gost ni uspela: ${error instanceof Error ? error.message : "neznana napaka"}`,
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="bg-grid-soft absolute inset-0" aria-hidden />
      <div className="bg-blob-mint absolute -left-24 top-16 size-80 rounded-full" aria-hidden />
      <div className="bg-blob-coral absolute -right-16 bottom-10 size-80 rounded-full" aria-hidden />

      <div className="relative flex flex-1 items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md pb-0 shadow-md">
          {step === "signIn" ? (
            <>
              <CardHeader className="text-center">
                <div className="flex justify-center">
                  <img
                    src={logo}
                    alt="Powersept"
                    width={72}
                    className="mb-2 mt-2 cursor-pointer rounded-lg"
                    onClick={() => navigate("/")}
                  />
                </div>
                <CardTitle className="text-xl">
                  {mode === "login" ? "Prijava v Powersept trgovino" : "Ustvarite Powersept račun"}
                </CardTitle>
                <CardDescription>
                  {mode === "login"
                    ? "Vnesite e-pošto za prijavo v obstoječ račun"
                    : "Vnesite ime in e-pošto — kodo pošljemo brez gesel"}
                </CardDescription>
                <div className="mt-4 grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
                  <button
                    type="button"
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                      mode === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                    onClick={() => {
                      setMode("login");
                      setError(null);
                    }}
                  >
                    Prijava
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                      mode === "register" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                    onClick={() => {
                      setMode("register");
                      setError(null);
                    }}
                  >
                    Registracija
                  </button>
                </div>
              </CardHeader>
              <form onSubmit={handleEmailSubmit}>
                <CardContent className="space-y-3">
                  {mode === "register" && (
                    <div className="relative">
                      <UserPlus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Ana Novak"
                        name="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-9"
                        disabled={isLoading}
                        autoComplete="name"
                        required
                      />
                    </div>
                  )}
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="email"
                        placeholder="ime@podjetje.si"
                        type="email"
                        className="pl-9"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="outline"
                      size="icon"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <p className="text-xs text-muted-foreground">
                    {mode === "register"
                      ? "Z registracijo soglašate s pogoji poslovanja in politiko zasebnosti. Račun omogoča sledenje naročilom in seznam želja."
                      : "Brez gesel — na e-pošto prejmete 6-mestno kodo. Novi uporabniki se ob prvi prijavi samodejno registrirajo."}
                  </p>

                  <div className="relative">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">ali</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4 w-full"
                      onClick={handleGuestLogin}
                      disabled={isLoading}
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Nadaljuj kot gost
                    </Button>
                  </div>
                </CardContent>
              </form>
            </>
          ) : (
            <>
              <CardHeader className="mt-4 text-center">
                <CardTitle>Preverite e-pošto</CardTitle>
                <CardDescription>
                  Kodo smo poslali na {step.email}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleOtpSubmit}>
                <CardContent className="pb-4">
                  <input type="hidden" name="email" value={step.email} />
                  <input type="hidden" name="code" value={otp} />

                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                          const form = (e.target as HTMLElement).closest("form");
                          if (form) {
                            form.requestSubmit();
                          }
                        }
                      }}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {error && (
                    <p className="mt-2 text-center text-sm text-red-500">{error}</p>
                  )}
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    Niste prejeli kode?{" "}
                    <Button
                      variant="link"
                      className="h-auto p-0"
                      onClick={() => setStep("signIn")}
                    >
                      Pošljite znova
                    </Button>
                  </p>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Preverjanje…
                      </>
                    ) : (
                      <>
                        Potrdi kodo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("signIn")}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Uporabi drug e-poštni naslov
                  </Button>
                </CardFooter>
              </form>
            </>
          )}

          <div className="rounded-b-lg border-t bg-muted px-6 py-4 text-center text-xs text-muted-foreground">
            Prijavite se hitro in varno — brez gesel. Vaše naročilo ostane shranjeno v računu.
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
