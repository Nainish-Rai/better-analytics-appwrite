"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  databases,
  WEBSITE_DATABASE_ID,
  WEBSITE_COLLECTION_ID,
} from "@/lib/appwrite";
import { ID } from "appwrite";
import { toast } from "react-hot-toast";
import { TrackingCode } from "@/components/tracking-code";
import { useAuth } from "@/providers/auth-provider";

interface WebsiteFormProps {
  onSuccess: () => void;
}

export function WebsiteForm({ onSuccess }: WebsiteFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [newTrackingId, setNewTrackingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const trackingId = ID.unique();
      if (!user) {
        toast.error("User not authenticated");
        setLoading(false);
        return;
      }

      await databases.createDocument(
        WEBSITE_DATABASE_ID,
        WEBSITE_COLLECTION_ID,
        ID.unique(),
        {
          name: formData.name,
          url: formData.url,
          trackingId,
          userId: user.$id,

          createdAt: new Date().toISOString(),
        }
      );

      setNewTrackingId(trackingId);
      onSuccess();
      toast.success("Website added successfully");
    } catch (error) {
      console.error("Failed to add website:", error);
      toast.error("Failed to add website");
    } finally {
      setLoading(false);
    }
  }

  if (newTrackingId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Website Added Successfully</CardTitle>
          <CardDescription>
            Add this tracking code to your website to start collecting analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TrackingCode trackingId={newTrackingId} />
          <Button
            onClick={() => {
              setNewTrackingId(null);
              setFormData({ name: "", url: "" });
            }}
          >
            Add Another Website
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Website</CardTitle>
        <CardDescription>
          Enter your website details to start tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              required
              placeholder="Website Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Input
              required
              type="url"
              placeholder="Website URL"
              value={formData.url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, url: e.target.value }))
              }
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Website"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
