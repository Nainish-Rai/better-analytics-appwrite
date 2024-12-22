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
  EventWithMetadata,
  TimeSeriesData,
} from "@/types/analytics";
import { Query } from "appwrite";

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
    clickEvents: [],
    formEvents: [],
    pageViews: [],
    sessions: {
      total: 0,
      averageDuration: 0,
    },
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
        EVENTS_COLLECTION_ID,
        [Query.equal("trackingId", trackingId), Query.limit(100)] // Add this filter
      );

      const events = response.documents as Event[];
      console.log("Analytics loaded:", events);
      if (events.length > 0) {
        updateAnalytics(events);
      }
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
    const parsedEvents = events.map((event) => ({
      ...event,
      metadata: event.metadata ? JSON.parse(event.metadata) : {},
    }));

    const pageViewEvents = parsedEvents.filter((e) => e.event === "pageview");
    console.log("Page view events:", pageViewEvents);
    const clickEvents = parsedEvents.filter((e) => e.event === "click");
    const formEvents = parsedEvents.filter((e) => e.event === "form_submit");

    // Calculate total page views
    const totalViews = pageViewEvents.length;

    // Calculate unique visitors using visitorId
    const uniqueVisitors = new Set(parsedEvents.map((e) => e.visitorId)).size;

    // Calculate session durations
    const sessionDurations = calculateSessionDurations(parsedEvents);
    const avgTime = sessionDurations.length
      ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
      : 0;

    // Calculate bounce rate
    const bounceRate = calculateBounceRate(parsedEvents);

    // Process page views
    const pageViews = aggregatePageViews(pageViewEvents);

    // Process device stats from user agent
    const devices = aggregateDeviceStats(parsedEvents);

    // Process custom events
    const customEvents = processCustomEvents(parsedEvents);

    setSummary({
      totalPageViews: totalViews,
      uniqueVisitors,
      averageTimeOnPage: avgTime,
      bounceRate,
      customEvents: Object.values(customEvents),
      clickEvents,
      formEvents,
      pageViews,
      sessions: {
        total: sessionDurations.length,
        averageDuration: avgTime,
      },
    });

    setTopPages(pageViews);
    setDeviceStats(devices);
    setPageViews(generateTimeSeriesData(pageViewEvents));
  }

  function processCustomEvents(events: Event[]) {
    return events
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
        const metadata =
          typeof event.metadata === "string"
            ? JSON.parse(event.metadata)
            : event.metadata;
        acc[name].metadata.push(metadata);
        return acc;
      }, {});
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
    const sessions = events.reduce((acc, event) => {
      if (!acc[event.visitorId]) {
        acc[event.visitorId] = [];
      }
      acc[event.visitorId].push(event);
      return acc;
    }, {} as Record<string, Event[]>);

    const totalSessions = Object.keys(sessions).length;
    const bouncedSessions = Object.values(sessions).filter(
      (sessionEvents) => sessionEvents.length === 1
    ).length;

    return totalSessions ? bouncedSessions / totalSessions : 0;
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

  function aggregatePageViews(events: Event[]): EventWithMetadata[] {
    const pages = events.reduce((acc, event) => {
      const page = event.page || "/";
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(pages)
      .map(([page, views]) => ({
        timestamp: new Date().toISOString(),
        metadata: { page, views },
        page, // Added property
        views, // Added property
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }

  function aggregateDeviceStats(events: Event[]): Record<string, number> {
    return events.reduce((acc, event) => {
      let device = "unknown";
      const ua = event.userAgent.toLowerCase();

      if (ua.includes("mobile")) {
        device = "mobile";
      } else if (ua.includes("tablet")) {
        device = "tablet";
      } else if (
        ua.includes("windows") ||
        ua.includes("macintosh") ||
        ua.includes("linux")
      ) {
        device = "desktop";
      }

      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  return { summary, pageViews, topPages, deviceStats, loading };
}
