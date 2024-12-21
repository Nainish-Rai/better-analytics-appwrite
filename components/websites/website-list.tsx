"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  databases,
  WEBSITE_DATABASE_ID,
  WEBSITE_COLLECTION_ID,
} from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ID } from "appwrite";
import toast from "react-hot-toast";

interface Website {
  $id: string;
  name: string;
  url: string;
  trackingId: string;
}

export function WebsiteList() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newWebsite, setNewWebsite] = useState({ name: "", url: "" });

  useEffect(() => {
    loadWebsites();
  }, []);

  async function loadWebsites() {
    try {
      const response = await databases.listDocuments(
        WEBSITE_DATABASE_ID,
        WEBSITE_COLLECTION_ID
      );
      setWebsites(response.documents as unknown as Website[]);
    } catch (error) {
      console.error("Failed to load websites:", error);
    }
  }

  async function addWebsite(e: React.FormEvent) {
    e.preventDefault();
    try {
      await databases.createDocument(
        WEBSITE_DATABASE_ID,
        WEBSITE_COLLECTION_ID,
        ID.unique(),
        {
          name: newWebsite.name,
          url: newWebsite.url,
          trackingId: ID.unique(),
        }
      );

      setNewWebsite({ name: "", url: "" });
      setIsOpen(false);
      loadWebsites();
      toast({
        title: "Success",
        description: "Website added successfully",
      });
    } catch (error) {
      console.error("Failed to add website:", error);
      toast({
        title: "Error",
        description: "Failed to add website",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Website
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Website</DialogTitle>
            </DialogHeader>
            <form onSubmit={addWebsite} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name">Website Name</label>
                <Input
                  id="name"
                  value={newWebsite.name}
                  onChange={(e) =>
                    setNewWebsite({ ...newWebsite, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="url">Website URL</label>
                <Input
                  id="url"
                  type="url"
                  value={newWebsite.url}
                  onChange={(e) =>
                    setNewWebsite({ ...newWebsite, url: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Website
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
              <TableCell className="font-mono">{website.trackingId}</TableCell>
              <TableCell>
                <Link
                  href={`/analytics/${website.trackingId}`}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  View Analytics
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
