import { Models } from "appwrite";

export interface Event extends Models.Document {
  trackingId: string;
  event: string;
  metadata: string; // Changed from Record<string, unknown> to string
  timestamp: string;
}

export interface CreateEventData {
  trackingId: string;
  event: string;
  metadata?: Record<string, unknown>;
}
