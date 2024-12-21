"use client";

import { useEffect, useState } from "react";
import { WebsiteForm } from "@/components/websites/website-form";
import {
  databases,
  WEBSITE_DATABASE_ID,
  WEBSITE_COLLECTION_ID,
} from "@/lib/appwrite";
import { Website } from "@/types/website";
import { Query } from "appwrite";
import { useAuth } from "@/providers/auth-provider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

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
      console.error(error);
    }
  }

  async function deleteWebsite(websiteId: string) {
    try {
      await databases.deleteDocument(
        WEBSITE_DATABASE_ID,
        WEBSITE_COLLECTION_ID,
        websiteId
      );
      toast.success("Website deleted successfully");
      loadWebsites();
    } catch (error) {
      toast.error("Failed to delete website");
      console.error(error);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Website Management</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Website</h2>
        <WebsiteForm onSuccess={loadWebsites} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Websites</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Tracking ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {websites.map((website) => (
              <TableRow key={website.$id}>
                <TableCell>{website.name}</TableCell>
                <TableCell>{website.url}</TableCell>
                <TableCell>{website.trackingId}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteWebsite(website.$id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
