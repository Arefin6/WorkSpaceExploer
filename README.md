# Mini Workspace Explorer

A responsive, browser-based file manager built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. It allows users to create, navigate, search, edit, rename, and delete nested folders and text files with persistent local storage.

---

## Table of Contents

- [Features](#features)
- [How to Run the Project](#how-to-run-the-project)
- [Project Structure](#project-structure)
- [Data Structure & Architecture](#data-structure--architecture)
- [State Management Approach](#state-management-approach)
- [Important Implementation Decisions](#important-implementation-decisions)

---

## Features

- **Hierarchical File Tree**: Collapsible, infinitely nested sidebar navigation.
- **Main Explorer Panel**: Interactive grid view with clickable breadcrumb navigation.
- **CRUD Operations**: Create, rename, and recursively delete folders and files.
- **Text File Editor**: Edit and save text file contents with unsaved changes detection.
- **Workspace-Wide Search**: Instantly filter files and folders across all directory levels.
- **Persistence**: Safe client-side storage persistence using `localStorage`.

---

## How to Run the Project

### Prerequisites

Ensure you have **Node.js 18.x** or higher and `npm`, `yarn`, or `pnpm` installed.

### 1. Installation

Clone the repository and install dependencies:

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

2. Development Server
   Run the local development server:

```bash
# or
npm run dev
# or
pnpm run dev
```

Open http://localhost:3000 in your browser to view the application.

## Project Structure
```bash
├── app/
│ ├── layout.tsx # Root application layout
│ ├── page.tsx # Main workspace entry point & modal coordinator
│ └── globals.css # Global Tailwind CSS styles
├── components/
│ ├── Sidebar.tsx # Container for the file explorer tree
│ ├── TreeNode.tsx # Recursive tree item component for sidebar
│ ├── MainPanel.tsx # Main layout for grid view, search, and editor
│ ├── FolderView.tsx # Grid representation of folder contents
│ ├── Breadcrumbs.tsx # Clickable path traversal navigation
│ ├── TextEditor.tsx # Plain text viewer/editor component
│ └── ActionModal.tsx # Create and rename validation modal
├── hooks/
│ ├── useExplorer.ts # Core workspace state & operation logic
│ └── useLocalStorage.ts # Hydration-safe local storage hook
├── libs/
│ └── explorerUtils.ts # Pure helper functions (CRUD, search, breadcrumbs)
├── types/
│ └── explorer.ts # TypeScript interface definitions
└── data/
└── initialData.ts # Default initial mock workspace seed data
```
Data Structure & Architecture

Rather than using a deeply nested tree object ({ id, name, children: [...] }), the filesystem is stored using a normalized flat dictionary (hash map) keyed by item IDs:

```bash
   export type ItemType = 'folder' | 'file';

export interface ExplorerItem {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null; // null represents Root Workspace level
  content?: string;        // Text content (files only)
  createdAt: number;
}

export type ExplorerMap = Record<string, ExplorerItem>;
```

Why a Normalized Map?

O(1) Constant Time Lookups:
Accessing or updating any item by ID takes constant time, avoiding expensive recursive tree traversals.

Simplified Immutability: Updating an item's content or name requires modifying a single object key without deep cloning ancestor trees.

Easy Parent & Child Queries:
Children of a folder: Object.values(items).filter(i => i.parentId === folderId)

Breadcrumb chain: Traversing upwards using item.parentId until null.

State Management Approach:

The application uses custom React hooks (useExplorer and useLocalStorage) to encapsulate logic and separate UI rendering from business operations:

useExplorer: Manages current folder navigation (selectedFolderId), active open text file (activeFileId), sidebar expanded paths, search queries, and action handlers.

useLocalStorage: Handles persistent syncing to localStorage.Pure Utility Layer 

(explorerUtils.ts): Core algorithms (cascading recursive deletes, search filtering, duplicate name validation) are extracted as pure functions to facilitate unit testing and isolate logic.

Important Implementation Decisions

1. Cascading Deletion & Smart Navigation Fallback
   Deleting a folder recursively collects all descendant IDs using a Set (O(N) execution) to purge nested files and subfolders simultaneously.
   If a user deletes the folder they are currently viewing, useExplorer automatically re-navigates them up to the deleted folder's parent (parentId).
2. Validation & Edge CasesDuplicate Prevention: Name creation/renaming enforces case-insensitive uniqueness within the target parent directory.
   Character Filtering: Prevents reserved OS file path characters (\ / : \* ? " < > |).
   Unsaved Changes: The text editor tracks dirty state (content !== originalContent) and prompts for user confirmation before closing unsaved work.
3. Server-Side Rendering (SSR) ProtectionDirect access to window.localStorage is deferred until useEffect mounts on the client to prevent Next.js SSR hydration mismatches.
