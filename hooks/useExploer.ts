"use client";

import { useState } from "react";
import { ExplorerMap, ExplorerItem } from "@/types/explorer";
import { INITIAL_FILES } from "@/data/initialData";
import { useLocalStorage } from "./useLocalStorage";
import { deleteItemRecursive, validateName } from "@/libs/explorerUtils";

export function useExplorer() {
  // 1. Persisted Workspace State
  const [items, setItems] = useLocalStorage<ExplorerMap>(
    "mini_workspace_items",
    INITIAL_FILES,
  );

  // 2. Navigation State
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null); // null = Root Workspace
  const [activeFileId, setActiveFileId] = useState<string | null>(null); // Currently opened text file
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({}); // Sidebar tree collapse state

  // 3. Search & Editor Unsaved Changes State
  const [searchQuery, setSearchQuery] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // --- ACTIONS ---

  // Toggle tree node expand/collapse
  const toggleFolderExpand = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  // Select folder & open tree paths leading to it
  const navigateToFolder = (folderId: string | null) => {
    setSelectedFolderId(folderId);
    if (folderId) {
      // Auto-expand parent folders up to root
      setExpandedFolders((prev) => {
        const updated = { ...prev, [folderId]: true };
        let current = items[folderId];
        while (current && current.parentId) {
          updated[current.parentId] = true;
          current = items[current.parentId];
        }
        return updated;
      });
    }
  };

  // Create new File or Folder
  const createItem = (name: string, type: "folder" | "file"): string | null => {
    const error = validateName(items, selectedFolderId, name);
    if (error) return error;

    const newId = `${type}-${Date.now()}`;
    const newItem: ExplorerItem = {
      id: newId,
      name: name.trim(),
      type,
      parentId: selectedFolderId,
      content: type === "file" ? "" : undefined,
      createdAt: Date.now(),
    };

    setItems((prev) => ({ ...prev, [newId]: newItem }));

    // Automatically select & open if it's a file
    if (type === "file") {
      setActiveFileId(newId);
    } else {
      // Expand current parent so user sees newly created folder
      if (selectedFolderId) {
        setExpandedFolders((prev) => ({ ...prev, [selectedFolderId]: true }));
      }
    }

    return null; // Success
  };

  // Rename File or Folder
  const renameItem = (id: string, newName: string): string | null => {
    const item = items[id];
    if (!item) return "Item not found";

    const error = validateName(items, item.parentId, newName, id);
    if (error) return error;

    setItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], name: newName.trim() },
    }));

    return null; // Success
  };

  // Delete File or Folder (Handling selected folder fallback & active file closing)
  const deleteItem = (id: string) => {
    const itemToDelete = items[id];
    if (!itemToDelete) return;

    // Edge Case Handle: If currently open file is inside deleted folder/file, close editor
    if (activeFileId === id) {
      setActiveFileId(null);
    }

    // Edge Case Handle: If currently selected folder (or any parent of it) is deleted, navigate up
    if (selectedFolderId === id) {
      setSelectedFolderId(itemToDelete.parentId);
    }

    // Perform recursive delete
    setItems((prev) => deleteItemRecursive(prev, id));
  };

  // Save File Content
  const updateFileContent = (fileId: string, content: string) => {
    setItems((prev) => {
      if (!prev[fileId]) return prev;
      return {
        ...prev,
        [fileId]: { ...prev[fileId], content },
      };
    });
    setHasUnsavedChanges(false);
  };

  return {
    items,
    selectedFolderId,
    activeFileId,
    expandedFolders,
    searchQuery,
    hasUnsavedChanges,
    setSearchQuery,
    setHasUnsavedChanges,
    setActiveFileId,
    navigateToFolder,
    toggleFolderExpand,
    createItem,
    renameItem,
    deleteItem,
    updateFileContent,
  };
}
