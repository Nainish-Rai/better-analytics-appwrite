/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAnalytics } from "@/hooks/use-analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CustomEvents } from "./custom-events";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface AnalyticsDashboardProps {
  trackingId: string;
}

export function AnalyticsDashboard({ trackingId }: AnalyticsDashboardProps) {
  const { summary, pageViews, topPages, deviceStats, loading } =
    useAnalytics(trackingId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
  };

  // // Format interaction data for display
  // const formatInteractionData = (metadata: Record<string, unknown>) => {
  //   return Object.entries(metadata)
  //     .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
  //     .join(" | ");
  // };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>

      {/* Existing metrics cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalPageViews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.uniqueVisitors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Time on Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(summary.averageTimeOnPage)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{`${Math.round(
              summary.bounceRate * 100
            )}%`}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="custom">Custom Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Existing charts */}
            <Card>
              <CardHeader>
                <CardTitle>Page Views Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pageViews}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        if (isNaN(date.getTime())) {
                          return "Invalid Date";
                        }
                        return date.toLocaleDateString();
                      }}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) =>
                        new Date(value).toLocaleString()
                      }
                      formatter={(value: number) => [value, "Views"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topPages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="page" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(deviceStats).map(
                        ([name, value]) => ({
                          name,
                          value,
                        })
                      )}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {Object.entries(deviceStats).map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interactions">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Click Events</CardTitle>
                <CardDescription>User click interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {summary.clickEvents.map((event: any, index) => (
                    <div
                      key={index}
                      className="mb-4 rounded-lg border p-3 text-sm"
                    >
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{format(new Date(event.timestamp), "PPpp")}</span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p>
                          <strong>Element:</strong>{" "}
                          {event.metadata.element as string}
                        </p>
                        {event.metadata.text && (
                          <p>
                            <strong>Text:</strong> {event.metadata.text}
                          </p>
                        )}
                        {event.metadata.path && (
                          <p className="text-xs text-muted-foreground">
                            <strong>Path:</strong> {event.metadata.path}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Submissions</CardTitle>
                <CardDescription>Form interaction events</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {summary.formEvents.map((event: any, index) => (
                    <div
                      key={index}
                      className="mb-4 rounded-lg border p-3 text-sm"
                    >
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{format(new Date(event.timestamp), "PPpp")}</span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p>
                          <strong>Form ID:</strong>{" "}
                          {event.metadata.formId || "N/A"}
                        </p>
                        <p>
                          <strong>Action:</strong> {event.metadata.formAction}
                        </p>
                        <p>
                          <strong>Fields:</strong>{" "}
                          {event.metadata.formFields?.length || 0}
                        </p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Page Views</CardTitle>
                <CardDescription>Detailed page view events</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {summary.pageViews.map((event: any, index) => (
                    <div
                      key={index}
                      className="mb-4 rounded-lg border p-3 text-sm"
                    >
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{format(new Date(event.timestamp), "PPpp")}</span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p>
                          <strong>Page:</strong> {event.metadata.path}
                        </p>
                        <p>
                          <strong>Title:</strong> {event.metadata.title}
                        </p>
                        {event.metadata.referrer && (
                          <p className="text-xs text-muted-foreground">
                            <strong>Referrer:</strong> {event.metadata.referrer}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Information</CardTitle>
                <CardDescription>User session details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <span>Total Sessions</span>
                      <span className="font-bold">
                        {summary.sessions.total}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Average Session Duration</span>
                      <span className="font-bold">
                        {formatTime(summary.sessions.averageDuration)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Bounce Rate</span>
                      <span className="font-bold">
                        {(summary.bounceRate * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom">
          <CustomEvents events={summary.customEvents} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
