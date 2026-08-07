"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Ghost, Search, Loader2, X } from "lucide-react";

export function UrlInput({
  url,
  onUrlChange,
  onSubmit,
  isLoading,
  hasPasskey,
  ghostMode,
  onGhostModeChange,
}: {
  url: string;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  hasPasskey: boolean;
  ghostMode: boolean;
  onGhostModeChange: (enabled: boolean) => void;
}) {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
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
          className={url ? "pr-8" : ""}
        />
        {url && !isLoading && hasPasskey && (
          <button
            type="button"
            onClick={() => onUrlChange("")}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <Button
        type="button"
        variant={ghostMode ? "default" : "secondary"}
        size="icon"
        onClick={() => onGhostModeChange(!ghostMode)}
        disabled={isLoading}
        aria-label="Ghost mode"
        aria-pressed={ghostMode}
        title="Ghost mode: don't save this analysis"
      >
        <Ghost className="size-4" />
      </Button>
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
