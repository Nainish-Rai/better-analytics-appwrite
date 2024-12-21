"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { WebsiteForm } from "@/components/websites/website-form";
import { Website } from "@/types/website";
import {
  databases,
  WEBSITE_DATABASE_ID,
  WEBSITE_COLLECTION_ID,
} from "@/lib/appwrite";
import { Query } from "appwrite";
import { useAuth } from "@/providers/auth-provider";

export default function DashboardPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadWebsites();
    }
  }, [user]);

  async function loadWebsites() {
    try {
      const response = await databases.listDocuments(
        WEBSITE_DATABASE_ID,
        WEBSITE_COLLECTION_ID,
        [Query.equal("userId", user?.$id || "")]
      );
      setWebsites(response.documents as Website[]);
    } catch (error) {
      console.error("Failed to load websites:", error);
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Add Website</h2>
        <WebsiteForm onSuccess={loadWebsites} />
      </div>

      {websites.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Websites</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map((website) => (
              <Card
                key={website.$id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/analytics/${website.trackingId}`)}
              >
                <CardHeader>
                  <CardTitle>{website.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{website.url}</p>
                  <p className="text-sm mt-2 font-mono">
                    ID: {website.trackingId}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
