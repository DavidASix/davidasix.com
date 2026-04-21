"use client";

import { useState, useCallback } from "react";
import { api } from "~/trpc/react";
import { getStoredPasskey, storePasskey, clearStoredPasskey } from "./utils";

export function usePasskey() {
  const [passkeyInput, setPasskeyInput] = useState("");
  const [encryptedPasskey, setEncryptedPasskey] = useState(
    () => getStoredPasskey() ?? "",
  );

  const hasPasskey = encryptedPasskey.length > 0;

  const encrypt = api.tools.encryptPasskey.useMutation();

  const handleEncryptPasskey = useCallback(() => {
    if (!passkeyInput.trim() || encrypt.isPending) return;
    encrypt.mutate(
      { passkey: passkeyInput.trim() },
      {
        onSuccess: (data) => {
          storePasskey(data.encrypted);
          setEncryptedPasskey(data.encrypted);
        },
      },
    );
  }, [passkeyInput, encrypt]);

  const handleClearPasskey = useCallback(() => {
    clearStoredPasskey();
    setEncryptedPasskey("");
    setPasskeyInput("");
  }, []);

  return {
    hasPasskey,
    encryptedPasskey,
    passkeyInput,
    setPasskeyInput,
    handleEncryptPasskey,
    handleClearPasskey,
    isEncrypting: encrypt.isPending,
    encryptError: encrypt.isError ? encrypt.error.message : null,
  };
}
