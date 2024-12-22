import { NextResponse } from "next/server";
import {
  databases,
  WEBSITE_DATABASE_ID,
  EVENTS_COLLECTION_ID,
} from "@/lib/appwrite";
import { ID } from "appwrite";
import { CreateEventData } from "@/types/event";

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
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const data = await request.json();

    // Validate required fields
    const {
      trackingId,
      event,
      metadata,
      visitorId,
      userAgent,
      language,
      screenSize,
      timestamp = new Date().toISOString(),
    } = data as CreateEventData;

    if (!trackingId || !event) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers }
      );
    }

    // Validate event type
    const validEvents = [
      "pageview",
      "click",
      "form_submit",
      "visibility_change",
      "scroll",
      "error",
    ];

    const isCustomEvent = event.startsWith("custom:");
    const isValidEvent = validEvents.includes(event) || isCustomEvent;

    if (!isValidEvent) {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400, headers }
      );
    }

    // Process metadata based on event type
    let processedMetadata = metadata || {};
    if (event === "pageview") {
      processedMetadata = {
        ...processedMetadata,
        referrer: processedMetadata.referrer || null,
        title: processedMetadata.title || null,
        path: processedMetadata.path || "/",
      };
    }

    // Create event document with enhanced data
    const eventDoc = await databases.createDocument(
      WEBSITE_DATABASE_ID,
      EVENTS_COLLECTION_ID,
      ID.unique(),
      {
        trackingId,
        event,
        metadata: JSON.stringify(processedMetadata),
        timestamp,
        visitorId: visitorId || ID.unique(),
        userAgent: userAgent || "unknown",
        language: language || "unknown",
        screenSize: screenSize || "unknown",
        sessionId: data.sessionId || ID.unique(),
        // Add additional context
        page: processedMetadata.path || "/",
        referrer: processedMetadata.referrer || null,
        device: getUserDevice(userAgent || ""),
      }
    );

    return NextResponse.json(
      { success: true, eventId: eventDoc.$id },
      { headers }
    );
  } catch (error) {
    console.error("Track API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers }
    );
  }
}

function getUserDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("mobile")) return "mobile";
  if (ua.includes("tablet")) return "tablet";
  if (
    ua.includes("windows") ||
    ua.includes("macintosh") ||
    ua.includes("linux")
  )
    return "desktop";
  return "unknown";
}
