import { ShoppingCart, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/lib/auth-store";
import { useCartStore } from "@/lib/cart-store";
import { useNavigate } from "react-router-dom";

export function TopBar() {
  const isMobile = useIsMobile();

  return (
    <header className="glass border-b border-card-border sticky top-0 z-40 rounded-none">
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Left Section - Sidebar Toggle & Logo */}
        <div className="flex items-center gap-3">
          {!isMobile && (
            <SidebarTrigger className="p-1.5 hover:bg-hover rounded-lg transition-colors" />
          )}
          
          {/* Logo/Brand - Always visible */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center">
              <img 
                src="/src/assets/chickerlogo-transparent.svg" 
                alt="Chicker Logo" 
                className="w-full h-full object-contain animate-pulse"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
              />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">Chicker</h1>
              <p className="text-xs text-muted-foreground">Meme Tees</p>
            </div>
          </div>
        </div>

        {/* Right Section - Cart & Profile */}
        <div className="flex items-center gap-2">
          {!isMobile && (
            <Button variant="ghost" size="icon" className="relative macos-hover rounded-lg h-8 w-8">
              <ShoppingCart className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs p-0 bg-accent text-accent-foreground"
              >
                3
              </Badge>
            </Button>
          )}
          
          <Button variant="ghost" size="icon" className="macos-hover rounded-lg h-8 w-8">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}