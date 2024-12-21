"use client";

import { useEffect, useState } from "react";
import { WebsiteForm } from "@/components/websites/website-form";
import { TrackingCode } from "@/components/tracking-code";
import { Website } from "@/types/website";
import {
  databases,
  WEBSITE_DATABASE_ID,
  WEBSITE_COLLECTION_ID,
} from "@/lib/appwrite";
import { Query } from "appwrite";
import { useAuth } from "@/providers/auth-provider";
import { AnalyticsDashboard } from "@/components/analytics/dashboard";

export default function DashboardPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const { user } = useAuth();

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
          <div className="space-y-6">
            {websites.map((website) => (
              <div
                key={website.$id}
                className="border rounded-lg p-4 space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">{website.name}</h3>
                  <p className="text-muted-foreground mb-4">{website.url}</p>
                  <TrackingCode trackingId={website.trackingId} />
                </div>
                <AnalyticsDashboard trackingId={website.trackingId} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
