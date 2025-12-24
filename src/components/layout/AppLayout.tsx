import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        {/* Desktop Sidebar */}
        {!isMobile && <AppSidebar />}
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className={`flex-1 overflow-auto macos-scroll app-launch-animate ${isMobile ? 'pb-20' : ''}`}>
            {children}
          </main>
        </div>
        
        {/* Mobile Bottom Sidebar */}
        {isMobile && <AppSidebar />}
      </div>
    </SidebarProvider>
  );
}