"use client";

import React from "react";
import { ExplorerItem, ExplorerMap } from "@/types/explorer";
import { getChildren } from "@/libs/explorerUtils";
import { ChevronRight, ChevronDown, Folder, FileText } from "lucide-react";

interface TreeNodeProps {
  item: ExplorerItem;
  items: ExplorerMap;
  selectedFolderId: string | null;
  activeFileId: string | null;
  expandedFolders: Record<string, boolean>;
  onSelectFolder: (id: string | null) => void;
  onSelectFile: (id: string) => void;
  onToggleExpand: (id: string) => void;
  depth?: number; // Tracks indentation level
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  item,
  items,
  selectedFolderId,
  activeFileId,
  expandedFolders,
  onSelectFolder,
  onSelectFile,
  onToggleExpand,
  depth = 0,
}) => {
  const isFolder = item.type === "folder";
  const isExpanded = !!expandedFolders[item.id];
  const isSelectedFolder = isFolder && selectedFolderId === item.id;
  const isActiveFile = !isFolder && activeFileId === item.id;

  // Get children if it's a folder
  const children = isFolder ? getChildren(items, item.id) : [];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      onSelectFolder(item.id);
      onToggleExpand(item.id);
    } else {
      onSelectFile(item.id);
    }
  };

  return (
    <div className="select-none">
      {/* Node Row */}
      <div
        onClick={handleClick}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        className={`flex items-center gap-2 py-1.5 pr-3 text-sm cursor-pointer rounded-md transition-colors ${
          isSelectedFolder
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-medium"
            : isActiveFile
              ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100 font-medium"
              : "hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800/60"
        }`}
      >
        {/* Folder Expand Arrow */}
        {isFolder ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(item.id);
            }}
            className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <span className="w-4" /> // Spacer alignment for files
        )}

        {/* Icon */}
        {isFolder ? (
          <Folder className="w-4 h-4 text-amber-500 fill-amber-500/20" />
        ) : (
          <FileText className="w-4 h-4 text-blue-500" />
        )}

        {/* Name */}
        <span className="truncate">{item.name}</span>
      </div>

      {/* Recursive Children Rendering */}
      {isFolder && isExpanded && (
        <div className="flex flex-col">
          {children.length === 0 ? (
            <div
              style={{ paddingLeft: `${(depth + 1) * 16 + 28}px` }}
              className="py-1 text-xs text-gray-400 italic"
            >
              (Empty folder)
            </div>
          ) : (
            children.map((child) => (
              <TreeNode
                key={child.id}
                item={child}
                items={items}
                selectedFolderId={selectedFolderId}
                activeFileId={activeFileId}
                expandedFolders={expandedFolders}
                onSelectFolder={onSelectFolder}
                onSelectFile={onSelectFile}
                onToggleExpand={onToggleExpand}
                depth={depth + 1}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
