import { Models } from "appwrite";

export interface Event extends Models.Document {
  metadata: string;
  trackingId: string;
  event: string;
  timestamp: string;
  visitorId: string;
  userAgent: string;
  language: string;
  screenSize: string;
  page?: string;
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
}

export interface CreateEventData {
  trackingId: string;
  event: string;
  metadata?: Record<string, unknown>;
  visitorId: string;
  userAgent: string;
  language: string;
  screenSize: string;
  timestamp: string;
}
