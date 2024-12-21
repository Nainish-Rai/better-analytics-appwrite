import { Models } from "appwrite";

export interface Website extends Models.Document {
  name: string;
  url: string;
  userId: string;
  trackingId: string;
  createdAt: string;
}

export interface CreateWebsiteData {
  name: string;
  url: string;
}
