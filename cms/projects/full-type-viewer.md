---
title: "Full Type Viewer"
slug: "full-type-viewer"
category: "Misc Software"
start_date: "2026-10-01"
active_development: false
short_description: "An experimental VS Code Insiders extension for exploring complex TypeScript 7 types in an expandable sidebar."
github_url: "https://github.com/DavidASix/ts-go-full-type"
has_privacy_policy: false
has_data_delete: false
features:
  - "Expandable type tree"
  - "Live updates from unsaved edits"
  - "Go to Definition from tree nodes"
  - "Copy the displayed type as TypeScript"
technologies:
  - "TypeScript 7 native preview"
  - "VS Code Extension API"
  - "Literally coded with 100% vibes"
---

This is a project I cared very little about quality in. I took the high-level "Vibe Coder" approach as I just needed it to work. Pls don't consider this a testament to my coding skill, but to my desire to make life easier (or something)

TypeScript hover tooltips can be hard (terrible) to read when a type contains a large union or several layers of nested objects. Full Type Viewer follows the identifier under the cursor and shows its type in a sidebar.

![A nested API contract expanded in the Full Type Viewer sidebar](local/full-type-viewer-api-contract.webp)

This VSCode extension connects to the TypeScript native-preview server already running in VS Code, so it uses the editor's active project and sees unsaved changes. It expands branches on demand and marks recursive references so the same type does not expand forever. You can also jump from a tree node to its definition or copy the displayed type as TypeScript.

![A discriminated union expanded to show its workflow states](local/full-type-viewer-workflow-union.webp)

The experimental build targets Linux x64 with VS Code Insiders and TypeScript native preview. The repository includes instructions for building and installing the extension.
