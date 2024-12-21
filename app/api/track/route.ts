import { NextResponse } from "next/server";
import {
  databases,
  WEBSITE_DATABASE_ID,
  EVENTS_COLLECTION_ID,
} from "@/lib/appwrite";
import { ID } from "appwrite";

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function POST(request: Request) {
  // Add CORS headers to POST response
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const data = await request.json();
    const { trackingId, event, metadata } = data;

    if (!trackingId || !event) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers }
      );
    }

    // Stringify metadata to store as string in Appwrite
    await databases.createDocument(
      WEBSITE_DATABASE_ID,
      EVENTS_COLLECTION_ID,
      ID.unique(),
      {
        trackingId,
        event,
        metadata: JSON.stringify(metadata), // Convert metadata to string
        timestamp: new Date().toISOString(),
      }
    );

    return NextResponse.json({ success: true }, { headers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers }
    );
  }
}
