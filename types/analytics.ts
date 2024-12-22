export interface PageView {
  path: string;
  title: string;
  referrer: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalPageViews: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  bounceRate: number;
  customEvents: CustomEventStats[];
  clickEvents: unknown[];
  formEvents: unknown[];
  pageViews: EventWithMetadata[];
  sessions: {
    total: number;
    averageDuration: number;
  };
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface CustomEventStats {
  name: string;
  count: number;
  metadata: Record<string, unknown>[];
}

export interface EventWithMetadata {
  timestamp: string;
  metadata: Record<string, unknown>;
  page: string;
  views: number;
}
