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
  );

  const Privacy = () => (
    <div className="space-y-6">
      <SectionHeader title="Privacy & Security" description="Protect your account" />
      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <h4 className="font-medium mb-2">Change Password</h4>
            <div className="space-y-3">
              <Input type="password" placeholder="Current password" />
              <Input type="password" placeholder="New password" />
              <Input type="password" placeholder="Confirm new password" />
              <Button>Update Password</Button>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
            <p className="text-sm text-muted-foreground mb-3">Add an extra layer of security</p>
            <Button variant="outline">Enable 2FA</Button>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-2 text-destructive">Danger Zone</h4>
            <p className="text-sm text-muted-foreground mb-3">These actions cannot be undone</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="text-destructive border-destructive">
                Deactivate Account
              </Button>
              <Button variant="outline" className="text-destructive border-destructive">
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const Profile = () => (
    <div className="space-y-6">
      <SectionHeader title="Profile" description="Your personal information" />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src="/api/placeholder/64/64" />
                <AvatarFallback className="text-base font-semibold">
                  {userInfo.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{userInfo.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {userInfo.location}
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => setIsEditingProfile((v) => !v)}>
              {isEditingProfile ? "Done" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={userInfo.name}
                onChange={(e) => setUserInfo((prev) => ({ ...prev, name: e.target.value }))}
                disabled={!isEditingProfile}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo((prev) => ({ ...prev, email: e.target.value }))}
                disabled={!isEditingProfile}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={userInfo.phone}
                onChange={(e) => setUserInfo((prev) => ({ ...prev, phone: e.target.value }))}
                disabled={!isEditingProfile}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={userInfo.location}
                onChange={(e) => setUserInfo((prev) => ({ ...prev, location: e.target.value }))}
                disabled={!isEditingProfile}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={userInfo.bio}
              onChange={(e) => setUserInfo((prev) => ({ ...prev, bio: e.target.value }))}
              disabled={!isEditingProfile}
              rows={3}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const Addresses = () => (
    <div className="space-y-6">
      <SectionHeader title="Addresses" description="Manage your shipping locations" />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Saved Addresses</CardTitle>
            <Button>Add New Address</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="p-4 rounded-lg border border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{address.name}</h4>
                    {address.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">{address.fullAddress}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddressChange(address.id, "isDefault", true)}
                    >
                      Set Default
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const Payments = () => (
    <div className="space-y-6">
      <SectionHeader title="Payments" description="Manage your payment methods" />
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">No saved payment methods</p>
            <Button>Add Card</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const General = () => (
    <div className="space-y-6">
      <SectionHeader title="General" description="Basic preferences" />
      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <Label htmlFor="language-gen">Language</Label>
            <select
              id="language-gen"
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

  const About = () => (
    <div className="space-y-6">
      <SectionHeader title="About" description="Version and legal" />
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">App Version</span>
            <span className="text-sm font-medium">1.0.0</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Terms of Service</span>
            <Button variant="outline" size="sm">View</Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Privacy Policy</span>
            <Button variant="outline" size="sm">View</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (active) {
      case "appearance":
        return <Appearance />;
      case "notifications":
        return <Notifications />;
      case "privacy":
        return <Privacy />;
      case "profile":
        return <Profile />;
      case "addresses":
        return <Addresses />;
      case "payments":
        return <Payments />;
      case "about":
        return <About />;
      case "general":
      default:
        return <General />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-6 py-6 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14">
                <AvatarImage src="/api/placeholder/64/64" />
                <AvatarFallback className="text-base font-semibold">
                  {userInfo.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Account Settings</h1>
                <div className="text-sm text-muted-foreground">Welcome back, {userInfo.name}</div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <Nav />
          <div>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;