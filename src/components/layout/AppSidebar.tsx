import { Home, Compass, Palette, Receipt, Settings, ShoppingCart } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Discover", url: "/discover", icon: Compass },
  { title: "Customize", url: "/customize", icon: Palette },
  { title: "Orders", url: "/orders", icon: Receipt },
  { title: "Settings", url: "/account", icon: Settings },
];

const quickActions = [
  { title: "Cart", url: "/cart", icon: ShoppingCart },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  // Mobile Bottom Navigation
  if (isMobile) {
    const coreNav = navigationItems.filter((n) => n.title !== "Settings")
    const settings = navigationItems.find((n) => n.title === "Settings")
    return (
      <div className="fixed bottom-2 left-3 right-3 z-50">
        <div className="rounded-full glass shadow-lg">
          <div className="flex items-center justify-around px-2 py-0.5">
          {coreNav.map((item) => {
            const active = isActive(item.url)
