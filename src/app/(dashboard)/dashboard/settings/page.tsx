import { Settings, User, Shield, Bell, Building, Globe } from "lucide-react";
import { Metadata } from "next";

import { Heading } from "@/components/common/heading";
import PageContainer from "@/components/dashboard/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Dashboard: Settings",
  description: "Manage your account settings, preferences, and organization configuration",
};

export default function SettingsPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-6">
        {/* Header Section */}
        <div className="space-y-1">
          <Heading
            title="Settings"
            description="Manage your account settings, preferences, and organization configuration"
            icon={<Settings className="h-6 w-6" />}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs defaultValue="profile" className="mx-auto w-full max-w-6xl">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 p-1 md:grid-cols-3 lg:grid-cols-5">
              <TabsTrigger value="profile" className="flex h-auto flex-col items-center gap-1 py-3">
                <User className="h-4 w-4" />
                <span className="text-xs">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex h-auto flex-col items-center gap-1 py-3">
                <Shield className="h-4 w-4" />
                <span className="text-xs">Security</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex h-auto flex-col items-center gap-1 py-3">
                <Bell className="h-4 w-4" />
                <span className="text-xs">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="organization" className="flex h-auto flex-col items-center gap-1 py-3">
                <Building className="h-4 w-4" />
                <span className="text-xs">Organization</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex h-auto flex-col items-center gap-1 py-3">
                <Globe className="h-4 w-4" />
                <span className="text-xs">Preferences</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and profile information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <input
                        type="email"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="john@example.com"
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bio</label>
                      <textarea
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        rows={3}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <button className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                      Save Changes
                    </button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Upload and manage your profile avatar.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <button className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                          Upload Photo
                        </button>
                        <button className="rounded-md px-4 py-2 text-red-600 transition-colors hover:bg-red-50">
                          Remove
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Password</label>
                      <input
                        type="password"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <input
                        type="password"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <button className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                      Update Password
                    </button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable 2FA</p>
                        <p className="text-muted-foreground text-sm">Use an authenticator app for enhanced security</p>
                      </div>
                      <Badge variant="secondary">Disabled</Badge>
                    </div>
                    <button className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                      Set Up 2FA
                    </button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>Manage your active login sessions.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <p className="font-medium">Chrome on macOS</p>
                          <p className="text-muted-foreground text-sm">Current session</p>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <p className="font-medium">Safari on iPhone</p>
                          <p className="text-muted-foreground text-sm">Last active 2 hours ago</p>
                        </div>
                        <button className="text-sm text-red-600 hover:text-red-700">Revoke</button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>Configure which email notifications you receive.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Security Alerts</p>
                        <p className="text-muted-foreground text-sm">Get notified about security-related events</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Product Updates</p>
                        <p className="text-muted-foreground text-sm">Stay informed about new features and updates</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Digest</p>
                        <p className="text-muted-foreground text-sm">Get a weekly summary of your activity</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Organization Invitations</p>
                        <p className="text-muted-foreground text-sm">
                          Notifications when invited to join organizations
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Organization Settings */}
            <TabsContent value="organization" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Settings</CardTitle>
                  <CardDescription>Manage your organization&apos;s configuration and settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="py-8 text-center">
                    <Building className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <p className="text-muted-foreground">
                      Organization settings will appear here once you join an organization.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize your dashboard appearance.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Theme</label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option>Light</option>
                        <option>Dark</option>
                        <option>System</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Language</label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Regional Settings</CardTitle>
                    <CardDescription>Configure your regional preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Time Zone</label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option>UTC-08:00 Pacific Time</option>
                        <option>UTC-05:00 Eastern Time</option>
                        <option>UTC+00:00 London</option>
                        <option>UTC+01:00 Paris</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Format</label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
}
