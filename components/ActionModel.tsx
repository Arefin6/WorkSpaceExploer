/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { ItemType } from "@/types/explorer";

interface ActionModalProps {
  isOpen: boolean;
  mode: "create" | "rename";
  itemType?: ItemType;
  initialValue?: string;
  onClose: () => void;
  onSubmit: (name: string) => string | null; // Returns error string if validation fails
}

export const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  mode,
  itemType = "folder",
  initialValue = "",
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(initialValue);
    setError(null);
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = onSubmit(name);
    if (validationError) {
      setError(validationError);
    } else {
      setError(null);
      onClose();
    }
  };

  const title =
    mode === "create"
      ? `Create New ${itemType === "folder" ? "Folder" : "File"}`
      : `Rename ${itemType === "folder" ? "Folder" : "File"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder={itemType === "file" ? "example.txt" : "Folder name"}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
            />
            {error && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              {mode === "create" ? "Create" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
