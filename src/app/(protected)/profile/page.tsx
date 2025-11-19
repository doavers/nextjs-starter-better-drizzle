import { PlusCircle } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AUTH_CONFIG } from "@/config/auth-config";
import { auth } from "@/lib/auth";

async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect(AUTH_CONFIG.loginPage);
  }

  return (
    <main className="mx-auto mt-10 max-w-screen-xl px-4 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Profile</h1>
          </div>
          <Button asChild>
            <Link href={`/post/create`}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Post
            </Link>
          </Button>
        </div>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your Profile Information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Name:</span> {session?.user?.name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {session?.user?.email}
              </div>
              <div>
                <span className="font-medium">Role:</span> {session?.user?.role?.toUpperCase()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default ProfilePage;
