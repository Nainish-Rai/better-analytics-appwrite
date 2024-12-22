"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomEventStats } from "@/types/analytics";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CustomEventsProps {
  events: CustomEventStats[];
}

export function CustomEvents({ events }: CustomEventsProps) {
  if (!events.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custom Events</CardTitle>
          <CardDescription>No custom events tracked yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Events</CardTitle>
        <CardDescription>Track custom interactions and events</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={events[0].name}>
          <TabsList className="w-full">
            {events.map((event) => (
              <TabsTrigger
                key={event.name}
                value={event.name}
                className="flex-1"
              >
                {event.name} ({event.count})
              </TabsTrigger>
            ))}
          </TabsList>
          {events.map((event) => (
            <TabsContent key={event.name} value={event.name}>
              <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="space-y-4">
                  {event.metadata.map((meta, index) => (
                    <div
                      key={index}
                      className="rounded-lg bg-muted p-3 text-sm space-y-2"
                    >
                      {Object.entries(meta).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium">{key}:</span>{" "}
                          {JSON.stringify(value)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
