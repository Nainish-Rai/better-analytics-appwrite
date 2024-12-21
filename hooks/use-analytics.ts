import { useState, useEffect } from "react";
import {
  client,
  databases,
  WEBSITE_DATABASE_ID,
  EVENTS_COLLECTION_ID,
} from "@/lib/appwrite";
import { Event } from "@/types/event";
import {
  AnalyticsSummary,
  CustomEventStats,
  TimeSeriesData,
} from "@/types/analytics";

interface PageViewsByPage {
  page: string;
  views: number;
}

export function useAnalytics(trackingId: string) {
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalPageViews: 0,
    uniqueVisitors: 0,
    averageTimeOnPage: 0,
    bounceRate: 0,
    customEvents: [],
  });
  const [pageViews, setPageViews] = useState<TimeSeriesData[]>([]);
  const [topPages, setTopPages] = useState<PageViewsByPage[]>([]);
  const [deviceStats, setDeviceStats] = useState<Record<string, number>>({});
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
    const filteredEvents = events.filter((e) => e.trackingId === trackingId);
    const pageViewEvents = filteredEvents.filter((e) => e.event === "pageview");

    // Calculate total page views
    const totalViews = pageViewEvents.length;

    // Calculate unique visitors
    const uniqueVisitors = new Set(pageViewEvents.map((e) => e.visitorId)).size;

    // Calculate average time on page
    const sessionDurations = calculateSessionDurations(pageViewEvents);
    const avgTime = sessionDurations.length
      ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
      : 0;

    // Calculate bounce rate
    const bounceRate = calculateBounceRate(pageViewEvents);

    // Top pages
    const pageViews = aggregatePageViews(pageViewEvents);

    // Device statistics
    const devices = aggregateDeviceStats(pageViewEvents);

    // Custom events
    const customEvents = processCustomEvents(filteredEvents);

    setSummary({
      totalPageViews: totalViews,
      uniqueVisitors,
      averageTimeOnPage: avgTime,
      bounceRate,
      customEvents,
    });

    setTopPages(pageViews);
    setDeviceStats(devices);
    setPageViews(generateTimeSeriesData(pageViewEvents));
  }

  function processCustomEvents(events: Event[]) {
    const customEvents = events
      .filter((e) => e.event.startsWith("custom:"))
      .reduce((acc: Record<string, CustomEventStats>, event) => {
        const name = event.event.replace("custom:", "");
        if (!acc[name]) {
          acc[name] = {
            name,
            count: 0,
            metadata: [],
          };
        }
        acc[name].count++;
        if (event.metadata) {
          acc[name].metadata.push(JSON.parse(event.metadata));
        }
        return acc;
      }, {});

    return Object.values(customEvents);
  }

  function calculateSessionDurations(events: Event[]): number[] {
    const sessionDurations: number[] = [];

    let currentSessionDuration = 0;

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if (event.event === "pageview") {
        if (i > 0) {
          sessionDurations.push(currentSessionDuration);
        }
        currentSessionDuration = 0;
      } else if (event.event === "click") {
        currentSessionDuration += 1;
      }
    }

    return sessionDurations;
  }

  function calculateBounceRate(events: Event[]): number {
    // Implementation for bounce rate calculation
    const uniqueVisitors = new Set(events.map((e) => e.visitorId));
    const uniqueVisitorsCount = uniqueVisitors.size;

    if (uniqueVisitorsCount > 1) {
      const lastEvent = events[events.length - 1];
      const firstEvent = events[0];
      const isBounced = lastEvent.visitorId !== firstEvent.visitorId;
      if (isBounced) {
        return 1;
      }
    }

    return 0;
  }
  function generateTimeSeriesData(events: Event[]): TimeSeriesData[] {
    const data = events.reduce((acc, event) => {
      const date = new Date(event.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(data).map(([date, count]) => ({
      timestamp: date,
      value: count,
    }));
  }
  function aggregatePageViews(events: Event[]): PageViewsByPage[] {
    const pages = events.reduce((acc, event) => {
      const page = event.page || "/";
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(pages)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }

  function aggregateDeviceStats(events: Event[]): Record<string, number> {
    return events.reduce((acc, event) => {
      const device = event.device || "unknown";
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  return { summary, pageViews, topPages, deviceStats, loading };
}
