import { useEffect, useState } from "react";
import { ShoppingCart, User, LogIn, Palette, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/lib/auth-store";
import { useCartStore } from "@/lib/cart-store";
import { useNavigate } from "react-router-dom";
import chickerLogo from "@/assets/chickerlogo-transparent.svg";

export function TopBar() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const [likedCount, setLikedCount] = useState(0);

  useEffect(() => {
    const updateLikes = () => {
      try {
        const raw = localStorage.getItem("likedProducts");
        const ids: string[] = raw ? JSON.parse(raw) : [];
        setLikedCount(ids.length);
      } catch {
        setLikedCount(0);
      }
    };
    updateLikes();
    window.addEventListener("liked-products-updated", updateLikes);
    window.addEventListener("storage", updateLikes);
    return () => {
      window.removeEventListener("liked-products-updated", updateLikes);
      window.removeEventListener("storage", updateLikes);
    };
  }, []);

  return (
    <header className="glass border-b border-card-border sticky top-0 z-40 rounded-none">
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Left Section - Sidebar Toggle & Logo */}
        <div className="flex items-center gap-3">
          {!isMobile && (
            <SidebarTrigger className="p-1.5 hover:bg-hover rounded-lg transition-colors" />
          )}

          {/* Logo/Brand - Clickable */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-left hover:opacity-90 transition-opacity"
          >
            <div className="w-7 h-7 flex items-center justify-center">
              <img
                src={chickerLogo}
                alt="Chicker Logo"
                className="w-full h-full object-contain"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
              />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">Chicker</h1>
              <p className="text-xs text-muted-foreground leading-none">Meme Tees</p>
            </div>
          </button>
        </div>

        {/* Right Section - Quick Customizer, Wishlist, Cart & Profile */}
        <div className="flex items-center gap-2">
          {!isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/customize")}
              className="glass border-glass-border text-xs h-8 gap-1.5"
            >
              <Palette className="h-3.5 w-3.5 text-primary" />
              <span>Design Your Own</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/discover?wishlist=1")}
            title="Saved / Liked Designs"
            className="relative macos-hover rounded-lg h-8 w-8"
          >
            <Heart className="h-4 w-4" />
            {likedCount > 0 && (
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 h-4 min-w-[16px] flex items-center justify-center text-[10px] px-1 bg-destructive text-destructive-foreground"
              >
                {likedCount}
              </Badge>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/cart")}
            title="Shopping Cart"
            className="relative macos-hover rounded-lg h-8 w-8"
          >
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 min-w-[16px] flex items-center justify-center text-[10px] px-1 bg-accent text-accent-foreground"
              >
                {itemCount}
              </Badge>
            )}
          </Button>

          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/account")}
              className="macos-hover rounded-lg h-8 gap-1.5 px-2"
              title={user?.name || "Account"}
            >
              <User className="h-4 w-4" />
              {!isMobile && (
                <span className="text-xs font-medium max-w-[100px] truncate">
                  {user?.name?.split(" ")[0] || "Account"}
                </span>
              )}
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/auth")}
              className="macos-hover rounded-lg h-8 gap-1.5 px-2"
            >
              <LogIn className="h-4 w-4" />
              {!isMobile && <span className="text-xs font-medium">Sign In</span>}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}