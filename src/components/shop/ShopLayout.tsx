import { Footer } from "@/components/shop/Footer";
import { Navbar } from "@/components/shop/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useCatalogSeed } from "@/hooks/use-shop";
import { useEffect } from "react";
import { Outlet } from "react-router";

export default function ShopLayout() {
  const seedOnce = useCatalogSeed();
  const { isLoading, isAuthenticated, signIn } = useAuth();

  useEffect(() => {
    seedOnce();
  }, [seedOnce]);

  // Visitors get a guest session automatically: cart and wishlist work
  // immediately, while email sign-in remains available at /prijava.
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      signIn("anonymous").catch(() => {
        // Non-fatal: cart operations will prompt to sign in instead.
      });
    }
  }, [isLoading, isAuthenticated, signIn]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
