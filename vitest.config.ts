import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [react() as any],
  test: {
    include: ["./src/**/*.test.{ts,tsx}"],
    environment: "node",
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
});
