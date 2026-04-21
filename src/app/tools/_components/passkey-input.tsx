"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Loader2, Key, LogOut } from "lucide-react";

export function PasskeyInput({
  hasPasskey,
  passkeyInput,
  onPasskeyChange,
  onPasskeySubmit,
  isEncrypting,
  onClearPasskey,
}: {
  hasPasskey: boolean;
  passkeyInput: string;
  onPasskeyChange: (passkey: string) => void;
  onPasskeySubmit: () => void;
  isEncrypting: boolean;
  onClearPasskey: () => void;
}) {
  if (hasPasskey) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">Passkey active</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearPasskey}
          className="text-muted-foreground"
        >
          <LogOut className="mr-1 size-3" />
          Clear
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Key className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          type="password"
          placeholder="Enter passkey"
          value={passkeyInput}
          onChange={(e) => onPasskeyChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && passkeyInput.trim()) onPasskeySubmit();
          }}
          disabled={isEncrypting}
          className="pl-9"
        />
      </div>
      <Button
        onClick={onPasskeySubmit}
        disabled={!passkeyInput.trim() || isEncrypting}
        size="default"
      >
        {isEncrypting ? <Loader2 className="size-4 animate-spin" /> : "Save"}
      </Button>
    </div>
  );
}
