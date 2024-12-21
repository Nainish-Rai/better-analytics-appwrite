import { useState, useEffect } from "react";
import {
  client,
  databases,
  WEBSITE_DATABASE_ID,
  EVENTS_COLLECTION_ID,
} from "@/lib/appwrite";
import { Event } from "@/types/event";
import { AnalyticsSummary, TimeSeriesData } from "@/types/analytics";

export function useAnalytics(trackingId: string) {
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalPageViews: 0,
    uniqueVisitors: 0,
    averageTimeOnPage: 0,
    bounceRate: 0,
  });
  const [pageViews, setPageViews] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
    subscribeToEvents();
  }, [trackingId]);

  async function loadAnalytics() {
    try {
      const response = await databases.listDocuments(
        WEBSITE_DATABASE_ID,
        EVENTS_COLLECTION_ID
      );

      const events = response.documents as Event[];
      updateAnalytics(events);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  }

  function subscribeToEvents() {
    const unsubscribe = client.subscribe(
      `databases.${WEBSITE_DATABASE_ID}.collections.${EVENTS_COLLECTION_ID}.documents`,
      (response) => {
        if (
          response.events.includes("databases.*.collections.*.documents.create")
        ) {
          const newEvent = response.payload as Event;
          if (newEvent.trackingId === trackingId) {
            updateAnalytics([newEvent]);
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }

  function updateAnalytics(events: Event[]) {
    // Update analytics calculations here
    // This is a simplified example
    const pageViewEvents = events.filter((e) => e.event === "pageview");

    setSummary((prev) => ({
      ...prev,
      totalPageViews: prev.totalPageViews + pageViewEvents.length,
    }));

    setPageViews((prev) => [
      ...prev,
      ...pageViewEvents.map((e) => ({
        timestamp: e.timestamp,
        value: 1,
      })),
    ]);
  }

  return { summary, pageViews, loading };
}
