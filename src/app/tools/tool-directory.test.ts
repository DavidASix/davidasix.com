import { readdirSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";
import { toolDirectory } from "./tool-directory";

const toolsDir = join(__dirname);

function getToolSubdirectories(): string[] {
  return readdirSync(toolsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => `/${entry.name}`);
}

describe("tool-directory", () => {
  it("has a metadata entry for every tool subdirectory", () => {
    const subdirs = getToolSubdirectories();
    const registeredRoutes = toolDirectory.map((t) => t.route);

    for (const subdir of subdirs) {
      expect(
        registeredRoutes,
        `No toolDirectory entry found for subdirectory "${subdir}" — add it to tool-directory.ts`,
      ).toContain(subdir);
    }
  });

  it("has no metadata entries for non-existent subdirectories", () => {
    const subdirs = getToolSubdirectories();

    for (const tool of toolDirectory) {
      expect(
        subdirs,
        `toolDirectory entry "${tool.route}" has no matching subdirectory under /tools/`,
      ).toContain(tool.route);
    }
  });

  it("all entries have required fields", () => {
    for (const tool of toolDirectory) {
      expect(tool.route, `${tool.title} missing route`).toBeTruthy();
      expect(tool.title, `entry missing title`).toBeTruthy();
      expect(tool.description, `${tool.title} missing description`).toBeTruthy();
      expect(tool.image, `${tool.title} missing image`).toBeTruthy();
      expect(
        tool.route,
        `${tool.title} route should not start with /tools/`,
      ).not.toMatch(/^\/tools\//);
    }
  });
});
