"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "~/components/ui/button";

/** Requires an explicit confirmation click before running an asynchronous destructive action. */
export function DeleteButton({
  disabled,
  onDelete,
}: {
  disabled: boolean;
  onDelete: () => Promise<void>;
}) {
  const [status, setStatus] = useState<"idle" | "confirming" | "deleting">(
    "idle",
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isConfirming = status !== "idle";

  /** Registers outside-click cancellation only while confirmation is armed. */
  useEffect(() => {
    if (status !== "confirming") return;

    /** Disarms confirmation when a click occurs outside the button. */
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !buttonRef.current?.contains(event.target)
      ) {
        setStatus("idle");
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [status]);

  /** Advances confirmation and keeps the control armed when deletion fails. */
  const handleClick = async () => {
    if (status === "idle") {
      setStatus("confirming");
      return;
    }

    setStatus("deleting");
    try {
      await onDelete();
      setStatus("idle");
    } catch {
      setStatus("confirming");
    }
  };

  return (
    <Button
      ref={buttonRef}
      type="button"
      variant={isConfirming ? "destructive" : "ghost"}
      size={isConfirming ? "default" : "icon"}
      className={isConfirming ? "h-10" : "size-10"}
      disabled={disabled || status === "deleting"}
      onClick={handleClick}
      aria-label={isConfirming ? "Confirm deletion" : "Delete"}
    >
      <Trash2 className="size-5" />
      {isConfirming && (
        <span>{status === "deleting" ? "Deleting…" : "Delete?"}</span>
      )}
    </Button>
  );
}
