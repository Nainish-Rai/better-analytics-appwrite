import { WebsiteList } from "@/components/websites/website-list";

export default function WebsitesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Websites</h1>
        <p className="text-muted-foreground">
          Manage your website tracking and analytics.
        </p>
      </div>
      <WebsiteList />
    </div>
  );
}
