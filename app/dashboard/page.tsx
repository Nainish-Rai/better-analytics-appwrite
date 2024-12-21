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
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
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
      toast.error("Failed to load websites");
    } finally {
      setLoading(false);
    }
  }

  async function deleteWebsite(websiteId: string) {
    try {
      await databases.deleteDocument(
        WEBSITE_DATABASE_ID,
        WEBSITE_COLLECTION_ID,
        websiteId
      );
      setWebsites((prev) => prev.filter((w) => w.$id !== websiteId));
      toast.success("Website deleted successfully");
    } catch (error) {
      console.error("Failed to delete website:", error);
      toast.error("Failed to delete website");
    }
    setDeleteId(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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
              <Card key={website.$id} className="relative group">
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/analytics/${website.trackingId}`)
                  }
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {website.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(website.$id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground truncate">
                      {website.url}
                    </p>
                    <p className="text-sm mt-2 font-mono">
                      ID: {website.trackingId}
                    </p>
                    <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p>
                          {new Date(website.$createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="text-green-600">Active</p>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this website and all its analytics
              data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteWebsite(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
