import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Settings as Cog,
  Palette,
  Bell,
  Shield,
  CreditCard,
  MapPin,
  User,
  Info,
  LogOut
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAuthStore } from "@/lib/auth-store";
import { useNavigate } from "react-router-dom";


type SectionKey =
  | "general"
  | "appearance"
  | "notifications"
  | "privacy"
  | "profile"
  | "addresses"
  | "payments"
  | "about";

const sections: { key: SectionKey; label: string; icon: any }[] = [
  { key: "general", label: "General", icon: Cog },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "privacy", label: "Privacy & Security", icon: Shield },
  { key: "profile", label: "Profile", icon: User },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "about", label: "About", icon: Info },
];

const SettingsPage = () => {
  const [active, setActive] = useState<SectionKey>("general");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: user?.name || "User",
    email: user?.email || "",
    phone: "+255 123 456 789",
    bio: "Meme enthusiast and t-shirt collector from Dar es Salaam",
    location: "Dar es Salaam, Tanzania",
    joinDate: "January 2024",
  });

  // Update user info when user data changes
  useEffect(() => {
    if (user) {
      setUserInfo(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Home",
      fullAddress: "123 Uhuru Street, Dar es Salaam, Tanzania",
      isDefault: true,
    },
    {
      id: 2,
      name: "Office",
      fullAddress: "456 Business District, Dar es Salaam, Tanzania",
      isDefault: false,
    },
  ]);

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    promotionalEmails: false,
    orderUpdates: true,
    darkMode: false,
    language: "English",
  });

  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setPreferences((prev) => ({ ...prev, darkMode: theme === "dark" }));
  }, [theme]);

  const handleAddressChange = (id: number, field: string, value: any) => {
    setAddresses((addresses) =>
      addresses.map((addr) => (addr.id === id ? { ...addr, [field]: value } : addr))
    );
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const Nav = () => (
    <nav className="rounded-xl border border-border bg-card p-2">
      {sections.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium macos-transition " +
              (isActive
                ? "bg-hover text-foreground ring-1 ring-border"
                : "text-muted-foreground hover:bg-hover")
            }
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
    <div className="mb-4">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );

  const Appearance = () => (
    <div className="space-y-6">
      <SectionHeader title="Appearance" description="Customize how Chicker looks and feels" />
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Dark Mode</h4>
              <p className="text-sm text-muted-foreground">Switch to the OLED dark theme</p>
            </div>
            <Switch
              checked={preferences.darkMode}
              onCheckedChange={(checked) => {
                handlePreferenceChange("darkMode", checked);
                setTheme(checked ? "dark" : "light");
              }}
            />
          </div>
          <Separator />
          <div>
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              value={preferences.language}
              onChange={(e) => handlePreferenceChange("language", e.target.value)}
              className="w-full mt-1 bg-input border border-input-border rounded-lg px-3 py-2"
            >
              <option value="English">English</option>
              <option value="Swahili">Kiswahili</option>
              <option value="French">Français</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const Notifications = () => (
    <div className="space-y-6">
      <SectionHeader title="Notifications" description="Control alerts and updates" />
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Push Notifications</h4>
              <p className="text-sm text-muted-foreground">Get real-time updates</p>
            </div>
            <Switch
              checked={preferences.pushNotifications}
              onCheckedChange={(checked) => handlePreferenceChange("pushNotifications", checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Promotional Emails</h4>
              <p className="text-sm text-muted-foreground">Special offers and new designs</p>
            </div>
            <Switch
              checked={preferences.promotionalEmails}
              onCheckedChange={(checked) => handlePreferenceChange("promotionalEmails", checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Order Updates</h4>
              <p className="text-sm text-muted-foreground">Shipping and delivery notifications</p>
            </div>
            <Switch
              checked={preferences.orderUpdates}
              onCheckedChange={(checked) => handlePreferenceChange("orderUpdates", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
