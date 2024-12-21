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
