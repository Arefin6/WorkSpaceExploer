"use client";

import React, { useState } from "react";
import { ExplorerMap } from "@/types/explorer";
import {
  getBreadcrumbs,
  getChildren,
  searchWorkspace,
} from "@/libs/explorerUtils";
import { Breadcrumbs } from "./BreadCrumbs";
import { Search, FolderPlus, FilePlus, X } from "lucide-react";

interface MainPanelProps {
  items: ExplorerMap;
  selectedFolderId: string | null;
  activeFileId: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onNavigate: (id: string | null) => void;
  onOpenFile: (id: string) => void;
  onCreateAction: (type: "folder" | "file") => void;
}

export const MainPanel: React.FC<MainPanelProps> = ({
  items,
  selectedFolderId,
  activeFileId,
  searchQuery,
  setSearchQuery,
  onNavigate,
  onOpenFile,
  onCreateAction,
}) => {
  // Compute breadcrumbs for the current folder navigation
  const breadcrumbSegments = getBreadcrumbs(items, selectedFolderId);

  return (
    <main className="flex-1 flex flex-col bg-white dark:bg-[#0a0a0a] min-w-0">
      {/* TOP TOOLBAR */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 gap-4">
        <div className="flex-1 min-w-0">
          <Breadcrumbs segments={breadcrumbSegments} onNavigate={onNavigate} />
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search workspace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 py-1.5 w-48 sm:w-64 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-gray-900 dark:text-gray-100"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Action Buttons (Hidden when searching or viewing a file) */}
          {!searchQuery && !activeFileId && (
            <div className="flex items-center gap-1.5 border-l border-gray-200 dark:border-gray-800 pl-3">
              <button
                onClick={() => onCreateAction("folder")}
                className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 rounded-md transition-colors"
                title="New Folder"
              >
                <FolderPlus className="w-5 h-5" />
              </button>
              <button
                onClick={() => onCreateAction("file")}
                className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 rounded-md transition-colors"
                title="New File"
              >
                <FilePlus className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeFileId ? (
          <div className="h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
            [TextEditor component will go here]
          </div>
        ) : searchQuery ? (
          <div className="h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
            [Search Results grid will go here]
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
            [Folder Contents grid will go here]
          </div>
        )}
      </div>
    </main>
  );
};
