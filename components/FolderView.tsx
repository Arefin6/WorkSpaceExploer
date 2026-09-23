"use client";

import React from "react";
import { ExplorerItem } from "@/types/explorer";
import { Folder, FileText, MoreVertical, Edit2, Trash2 } from "lucide-react";

interface FolderViewProps {
  items: ExplorerItem[];
  onOpenFolder: (id: string) => void;
  onOpenFile: (id: string) => void;
  onRename: (item: ExplorerItem) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

export const FolderView: React.FC<FolderViewProps> = ({
  items,
  onOpenFolder,
  onOpenFile,
  onRename,
  onDelete,
  emptyMessage = "This folder is empty.",
}) => {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Folder className="w-12 h-12 stroke-[1.5] mb-2 text-gray-300 dark:text-gray-700" />
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {items.map((item) => {
        const isFolder = item.type === "folder";

        return (
          <div
            key={item.id}
            onClick={() =>
              isFolder ? onOpenFolder(item.id) : onOpenFile(item.id)
            }
            className="group relative flex flex-col items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 cursor-pointer transition-all text-center select-none"
          >
            {/* Context Menu Button */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(activeMenuId === item.id ? null : item.id);
                }}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md hover:bg-gray-200/50 dark:hover:bg-gray-800"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {activeMenuId === item.id && (
                <div
                  onMouseLeave={() => setActiveMenuId(null)}
                  className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg py-1 z-20 text-left"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(null);
                      onRename(item);
                    }}
                    className="flex items-center w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-2 text-gray-500" />
                    Rename
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(null);
                      if (
                        confirm(
                          `Are you sure you want to delete "${item.name}"?`,
                        )
                      ) {
                        onDelete(item.id);
                      }
                    }}
                    className="flex items-center w-full px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Icon */}
            <div className="my-2">
              {isFolder ? (
                <Folder className="w-12 h-12 text-amber-500 fill-amber-500/20 stroke-[1.5]" />
              ) : (
                <FileText className="w-12 h-12 text-blue-500 stroke-[1.5]" />
              )}
            </div>

            {/* Item Name */}
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate w-full px-1">
              {item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};
