import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Lock, Bell, Eye, Shield, Smartphone } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Settings() {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState({
    email: user?.email || "",
    name: user?.name || "",
    twoFAEnabled: false,
    emailNotifications: true,
    pushNotifications: false,
    tradingAlerts: true,
    priceAlerts: true,
    theme: "dark",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <Input value={settings.name} onChange={(e) => setSettings({...settings, name: e.target.value})} className="bg-gray-800 border-gray-700 text-white mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Email</label>
                <Input type="email" value={settings.email} onChange={(e) => setSettings({...settings, email: e.target.value})} className="bg-gray-800 border-gray-700 text-white mt-1" />
              </div>
              <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" /> Two-Factor Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">2FA Status</p>
                  <p className="text-sm text-gray-400">Protect your account with 2FA</p>
                </div>
                <Badge variant={settings.twoFAEnabled ? "default" : "secondary"}>
                  {settings.twoFAEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <Button onClick={() => setSettings({...settings, twoFAEnabled: !settings.twoFAEnabled})} className="bg-purple-600 hover:bg-purple-700">
                <Smartphone className="w-4 h-4 mr-2" /> {settings.twoFAEnabled ? "Disable" : "Enable"} 2FA
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input type="password" placeholder="Current Password" className="bg-gray-800 border-gray-700 text-white" />
              <Input type="password" placeholder="New Password" className="bg-gray-800 border-gray-700 text-white" />
              <Input type="password" placeholder="Confirm Password" className="bg-gray-800 border-gray-700 text-white" />
              <Button className="bg-blue-600 hover:bg-blue-700">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" /> Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Email Notifications", key: "emailNotifications" },
                { label: "Push Notifications", key: "pushNotifications" },
                { label: "Trading Alerts", key: "tradingAlerts" },
                { label: "Price Alerts", key: "priceAlerts" },
              ].map((notif) => (
                <label key={notif.key} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={settings[notif.key as keyof typeof settings] as boolean} onChange={(e) => setSettings({...settings, [notif.key]: e.target.checked})} className="rounded" />
                  <span className="text-white">{notif.label}</span>
                </label>
              ))}
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 w-full">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Theme</label>
                <select value={settings.theme} onChange={(e) => setSettings({...settings, theme: e.target.value})} className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 mt-1">
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 w-full">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-red-950 border-red-900">
        <CardHeader>
          <CardTitle className="text-red-400">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="destructive" className="w-full" onClick={logout}>
            Logout
          </Button>
          <Button variant="destructive" className="w-full">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
