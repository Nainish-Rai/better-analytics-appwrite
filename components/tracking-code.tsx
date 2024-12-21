"use client";

import { generateTrackingScript } from "@/lib/tracking-script";
import Editor from "@monaco-editor/react";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";

interface TrackingCodeProps {
  trackingId: string;
}

export function TrackingCode({ trackingId }: TrackingCodeProps) {
  const trackingScript = generateTrackingScript(trackingId);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingScript);
    toast.success("Tracking code copied to clipboard");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Tracking Code</h3>
        <Button onClick={copyToClipboard} size="sm">
          Copy Code
        </Button>
      </div>
      <div className="h-[300px] border rounded-md overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={trackingScript}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
          }}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Add this code to your website&apos;s &lt;head&gt; tag to start tracking.
      </p>
    </div>
  );
}
