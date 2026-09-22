import { ExplorerMap } from "../types/explorer";

export const INITIAL_FILES: ExplorerMap = {
  "folder-projects": {
    id: "folder-projects",
    name: "Projects",
    type: "folder",
    parentId: null,
    createdAt: Date.now(),
  },
  "folder-webbly": {
    id: "folder-webbly",
    name: "Webbly",
    type: "folder",
    parentId: "folder-projects",
    createdAt: Date.now(),
  },
  "file-notes": {
    id: "file-notes",
    name: "notes.txt",
    type: "file",
    parentId: "folder-webbly",
    content: "Welcome to Webbly notes!\nThis is a sample text file.",
    createdAt: Date.now(),
  },
  "file-tasks": {
    id: "file-tasks",
    name: "tasks.txt",
    type: "file",
    parentId: "folder-webbly",
    content:
      "- Build Mini Workspace Explorer\n- Add TypeScript\n- Master state management",
    createdAt: Date.now(),
  },
  "folder-personal": {
    id: "folder-personal",
    name: "Personal",
    type: "folder",
    parentId: "folder-projects",
    createdAt: Date.now(),
  },
  "folder-documents": {
    id: "folder-documents",
    name: "Documents",
    type: "folder",
    parentId: null,
    createdAt: Date.now(),
  },
  "file-readme": {
    id: "file-readme",
    name: "README.txt",
    type: "file",
    parentId: null,
    content:
      "# Mini Workspace Explorer\nA lightweight browser-based file manager built with Next.js & Tailwind CSS.",
    createdAt: Date.now(),
  },
};
