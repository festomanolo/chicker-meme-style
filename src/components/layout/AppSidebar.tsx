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
            return (
              <NavLink 
                key={item.title} 
                to={item.url} 
                className={() => {
                  const baseClasses = "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200";
                  if (active) {
                    return `${baseClasses} text-primary`;
                  }
                  return `${baseClasses} text-muted-foreground hover:text-foreground hover:bg-hover`;
                }}
              >
                <span className={active ? "p-1.5 rounded-full ring-2 ring-primary" : ""}>
                  <item.icon className={active ? "h-5 w-5 text-primary stroke-[2.25]" : "h-5 w-5"} />
                </span>
                {active && <span className="text-xs">{item.title}</span>}
              </NavLink>
            )
          })}
          {quickActions.map((item) => {
            const active = isActive(item.url)
            return (
              <NavLink 
                key={item.title} 
                to={item.url} 
                className={() => {
                  const baseClasses = "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200";
                  if (active) {
                    return `${baseClasses} text-primary`;
                  }
                  return `${baseClasses} text-muted-foreground hover:text-foreground hover:bg-hover`;
                }}
              >
                <span className={active ? "p-1.5 rounded-full ring-2 ring-primary" : ""}>
                  <item.icon className={active ? "h-5 w-5 text-primary stroke-[2.25]" : "h-5 w-5"} />
                </span>
                {active && <span className="text-xs">{item.title}</span>}
              </NavLink>
            )
          })}
          {settings && (() => {
            const active = isActive(settings.url)
            const ItemIcon = settings.icon
            return (
              <NavLink 
                key={settings.title} 
                to={settings.url} 
                className={() => {
                  const baseClasses = "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200";
                  if (active) {
                    return `${baseClasses} text-primary`;
                  }
                  return `${baseClasses} text-muted-foreground hover:text-foreground hover:bg-hover`;
                }}
              >
                <span className={active ? "p-1.5 rounded-full ring-2 ring-primary" : ""}>
                  <ItemIcon className={active ? "h-5 w-5 text-primary stroke-[2.25]" : "h-5 w-5"} />
                </span>
                {active && <span className="text-xs">{settings.title}</span>}
              </NavLink>
            )
          })()}
          </div>
        </div>
      </div>
    );
  }

  // Desktop Sidebar
  return (
    <Sidebar
      className="glass-card border-r border-sidebar-border transition-all duration-300"
      collapsible="icon"
    >
      <SidebarContent className={collapsed ? "p-2" : "p-4"}>
        {/* App Logo */}
        <div className={collapsed ? "mb-4" : "mb-6"}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-foreground">Chicker</h1>
                <p className="text-xs text-muted-foreground">Meme Tees</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    size="default"
                    className={collapsed ? "justify-start pl-1" : ""}
                  >
                    <NavLink to={item.url}>
                      <item.icon className={collapsed ? "h-5 w-5" : "h-4 w-4"} />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup className={collapsed ? "mt-4" : "mt-6"}>
          {!collapsed && (
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    size="default"
                    className={collapsed ? "justify-start pl-1" : ""}
                  >
                    <NavLink to={item.url}>
                      <item.icon className={collapsed ? "h-5 w-5" : "h-4 w-4"} />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}