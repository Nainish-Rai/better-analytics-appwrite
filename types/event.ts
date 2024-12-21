import { Models } from "appwrite";

export interface Event extends Models.Document {
  trackingId: string;
  event: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export interface CreateEventData {
  trackingId: string;
  event: string;
  metadata?: Record<string, unknown>;
}
