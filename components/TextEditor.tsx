/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { ExplorerItem } from "@/types/explorer";
import { Save, X, FileText } from "lucide-react";

interface TextEditorProps {
  file: ExplorerItem;
  onSave: (content: string) => void;
  onClose: () => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  file,
  onSave,
  onClose,
  setHasUnsavedChanges,
}) => {
  const [content, setContent] = useState(file.content || "");

  // Reset content when switching files
  useEffect(() => {
    setContent(file.content || "");
    setHasUnsavedChanges(false);
  }, [file.id, file.content, setHasUnsavedChanges]);

  const isDirty = content !== (file.content || "");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    setHasUnsavedChanges(val !== (file.content || ""));
  };

  const handleSave = () => {
    onSave(content);
  };

  const handleClose = () => {
    if (isDirty) {
      if (
        confirm(
          "You have unsaved changes. Are you sure you want to close without saving?",
        )
      ) {
        setHasUnsavedChanges(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
      {/* Editor Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {file.name}
          </span>
          {isDirty && (
            <span className="px-2 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded font-medium">
              Unsaved
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              isDirty
                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Close File"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Type file contents here..."
        className="flex-1 w-full p-4 text-sm font-mono bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none resize-none"
      />
    </div>
  );
};
