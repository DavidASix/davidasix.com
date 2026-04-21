"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Search, Loader2 } from "lucide-react";

export function UrlInput({
  url,
  onUrlChange,
  onSubmit,
  isLoading,
  hasPasskey,
}: {
  url: string;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  hasPasskey: boolean;
}) {
  return (
    <div className="flex gap-2">
      <Input
        type="url"
        placeholder="https://www.youtube.com/watch?v=..."
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && url.trim() && hasPasskey && !isLoading)
            onSubmit();
        }}
        disabled={isLoading || !hasPasskey}
      />
      <Button
        onClick={onSubmit}
        disabled={!url.trim() || !hasPasskey || isLoading}
        size="default"
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Search className="size-4" />
        )}
        Analyze
      </Button>
    </div>
  );
}
