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
