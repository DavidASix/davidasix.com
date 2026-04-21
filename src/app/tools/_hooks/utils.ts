const STORAGE_KEY = "tools_passkey";

export function getStoredPasskey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storePasskey(encrypted: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, encrypted);
  } catch {}
}

export function clearStoredPasskey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
