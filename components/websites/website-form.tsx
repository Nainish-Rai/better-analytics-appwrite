"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  databases,
  WEBSITE_DATABASE_ID,
  WEBSITE_COLLECTION_ID,
} from "@/lib/appwrite";
import { ID } from "appwrite";
import toast from "react-hot-toast";
import { useAuth } from "@/providers/auth-provider";

const websiteSchema = z.object({
  name: z.string().min(2),
  url: z.string().url(),
});

export function WebsiteForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof websiteSchema>>({
    resolver: zodResolver(websiteSchema),
  });

  async function onSubmit(data: z.infer<typeof websiteSchema>) {
    if (!user) return;

    setIsLoading(true);
    try {
      await databases.createDocument(
        WEBSITE_DATABASE_ID,
        WEBSITE_COLLECTION_ID,
        ID.unique(),
        {
          ...data,
          userId: user.$id,
          trackingId: ID.unique(),
          createdAt: new Date().toISOString(),
        }
      );
      toast.success("Website added successfully");
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to add website");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("name")}
        placeholder="Website Name"
        disabled={isLoading}
      />
      {errors.name && (
        <p className="text-sm text-red-500">{errors.name.message}</p>
      )}

      <Input
        {...register("url")}
        placeholder="Website URL"
        type="url"
        disabled={isLoading}
      />
      {errors.url && (
        <p className="text-sm text-red-500">{errors.url.message}</p>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Website"}
      </Button>
    </form>
  );
}
