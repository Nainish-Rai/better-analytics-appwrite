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
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}
