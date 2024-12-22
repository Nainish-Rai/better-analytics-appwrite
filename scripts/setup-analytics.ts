import { Client, Databases, IndexType } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!); // Create an API key in Appwrite Console

const databases = new Databases(client);

async function setupAnalytics() {
  try {
    // 1. Create Database
    const databaseId = "676713c3003e6713708b";

    // 2. Create Events Collection
    const collection = await databases.createCollection(
      databaseId,
      "events",
      "Events Collection"
    );

    console.log("Collection created:", collection.$id);

    // 3. Create Attributes with adjusted sizes
    const attributes = [
      { key: "trackingId", type: "string", size: 36, required: true }, // UUID length
      { key: "event", type: "string", size: 64, required: true }, // Shorter event names
      { key: "metadata", type: "string", size: 16384, required: true }, // Large for JSON
      { key: "timestamp", type: "string", size: 32, required: true }, // ISO date length
      { key: "visitorId", type: "string", size: 36, required: true }, // UUID length
      { key: "userAgent", type: "string", size: 512, required: true }, // Browser UA
      { key: "language", type: "string", size: 10, required: true }, // Language code
      { key: "screenSize", type: "string", size: 16, required: true }, // Format: 1920x1080
      { key: "sessionId", type: "string", size: 36, required: true }, // UUID length
      { key: "page", type: "string", size: 256, required: true }, // URL path
      { key: "referrer", type: "string", size: 512, required: false }, // Referrer URL
      { key: "device", type: "string", size: 16, required: true }, // mobile/desktop/tablet
    ];

    // Create attributes
    for (const attr of attributes) {
      await databases.createStringAttribute(
        databaseId,
        collection.$id,
        attr.key,
        attr.size,
        attr.required
      );
      console.log(`Created attribute: ${attr.key}`);
      // Add delay to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // 4. Create Indexes with specific lengths
    const indexes = [
      { key: "trackingId_idx", type: "key", attributes: ["trackingId"] },
      { key: "event_type_idx", type: "key", attributes: ["event"] },
      { key: "timestamp_idx", type: "key", attributes: ["timestamp"] },
      { key: "visitor_idx", type: "key", attributes: ["visitorId"] },
      { key: "session_idx", type: "key", attributes: ["sessionId"] },
      { key: "page_idx", type: "key", attributes: ["page"] },
      { key: "device_idx", type: "key", attributes: ["device"] },
    ];

    // Create indexes with delay between each
    for (const index of indexes) {
      await databases.createIndex(
        databaseId,
        collection.$id,
        index.key,
        index.type as IndexType,
        index.attributes,
        // Add these options to ensure index creation works
        ["ASC"]
      );
      console.log(`Created index: ${index.key}`);
      // Add delay to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("Analytics setup completed successfully!");

    // Save these IDs in your .env file
    console.log("\nAdd these to your .env file:");
    console.log(`NEXT_PUBLIC_DATABASE_ID=${databaseId}`);
    console.log(`NEXT_PUBLIC_EVENTS_COLLECTION_ID=${collection.$id}`);
  } catch (error) {
    console.error("Setup failed:", error);
    // Log more detailed error information
    if (error instanceof Error && "response" in error) {
      const responseError = error as {
        response: { message: string; code: number; type: string };
      };
      console.error("Error details:", {
        message: responseError.response.message,
        code: responseError.response.code,
        type: responseError.response.type,
      });
    }
  }
}

setupAnalytics();
