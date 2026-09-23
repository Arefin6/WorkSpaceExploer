"use client";

import React from "react";
import { ExplorerMap } from "@/types/explorer";
import { getChildren } from "@/libs/explorerUtils";
import { TreeNode } from "./TreeNode";
import { HardDrive } from "lucide-react";

interface SidebarProps {
  items: ExplorerMap;
  selectedFolderId: string | null;
  activeFileId: string | null;
  expandedFolders: Record<string, boolean>;
  onSelectFolder: (id: string | null) => void;
  onSelectFile: (id: string) => void;
  onToggleExpand: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  selectedFolderId,
  activeFileId,
  expandedFolders,
  onSelectFolder,
  onSelectFile,
  onToggleExpand,
}) => {
  // Top-level root items (parentId === null)
  const rootItems = getChildren(items, null);

  const isRootSelected = selectedFolderId === null;

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col h-full select-none">
      <div className="p-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Workspace Explorer
      </div>

      {/* Root "Workspace" Button */}
      <div className="px-2 mb-1">
        <button
          type="button"
          onClick={() => onSelectFolder(null)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
            isRootSelected
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-medium"
              : "hover:bg-gray-200/60 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
        >
          <HardDrive className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Workspace (Root)</span>
        </button>
      </div>

      {/* Tree Hierarchy */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {rootItems.length === 0 ? (
          <div className="px-3 py-2 text-xs text-gray-400 italic">
            Workspace is empty
          </div>
        ) : (
          rootItems.map((item) => (
            <TreeNode
              key={item.id}
              item={item}
              items={items}
              selectedFolderId={selectedFolderId}
              activeFileId={activeFileId}
              expandedFolders={expandedFolders}
              onSelectFolder={onSelectFolder}
              onSelectFile={onSelectFile}
              onToggleExpand={onToggleExpand}
              depth={0}
            />
          ))
        )}
      </div>
    </aside>
  );
};
