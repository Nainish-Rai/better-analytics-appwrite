import { NextResponse } from "next/server";
import { databases, WEBSITE_DATABASE_ID } from "@/lib/appwrite";
import { ID } from "appwrite";

const EVENTS_COLLECTION_ID = "events";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { trackingId, event, metadata } = data;

    if (!trackingId || !event) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await databases.createDocument(
      WEBSITE_DATABASE_ID,
      EVENTS_COLLECTION_ID,
      ID.unique(),
      {
        trackingId,
        event,
        metadata,
        timestamp: new Date().toISOString(),
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
