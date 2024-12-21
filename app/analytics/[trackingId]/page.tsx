import { AnalyticsDashboard } from "@/components/analytics/dashboard";

interface AnalyticsPageProps {
  params: {
    trackingId: string;
  };
}

export default function AnalyticsPage({ params }: AnalyticsPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Tracking ID: {params.trackingId}
        </p>
      </div>
      <AnalyticsDashboard trackingId={params.trackingId} />
    </div>
  );
}
