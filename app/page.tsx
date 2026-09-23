"use client";

import React, { useState } from "react";
import { useExplorer } from "@/hooks/useExploer";
import { Sidebar } from "@/components/Sidebar";
import { MainPanel } from "@/components/MainPanel";
import { ActionModal } from "@/components/ActionModel";
import { ExplorerItem, ItemType } from "@/types/explorer";

export default function WorkspaceExplorerPage() {
  const {
    items,
    selectedFolderId,
    activeFileId,
    expandedFolders,
    searchQuery,
    setSearchQuery,
    setHasUnsavedChanges,
    setActiveFileId,
    navigateToFolder,
    toggleFolderExpand,
    createItem,
    renameItem,
    deleteItem,
    updateFileContent,
  } = useExplorer();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "rename">("create");
  const [modalItemType, setModalItemType] = useState<ItemType>("folder");
  const [targetItem, setTargetItem] = useState<ExplorerItem | null>(null);

  // Handlers to open Modal
  const handleOpenCreateModal = (type: ItemType) => {
    setActiveFileId(null); // Close file view if open
    setModalMode("create");
    setModalItemType(type);
    setTargetItem(null);
    setIsModalOpen(true);
  };

  const handleOpenRenameModal = (item: ExplorerItem) => {
    setModalMode("rename");
    setModalItemType(item.type);
    setTargetItem(item);
    setIsModalOpen(true);
  };

  // Submit Modal Logic
  const handleModalSubmit = (name: string): string | null => {
    if (modalMode === "create") {
      return createItem(name, modalItemType);
    } else if (modalMode === "rename" && targetItem) {
      return renameItem(targetItem.id, name);
    }
    return null;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100 dark:bg-black font-sans antialiased text-gray-900 dark:text-gray-100">
      {/* Sidebar Navigation */}
      <Sidebar
        items={items}
        selectedFolderId={selectedFolderId}
        activeFileId={activeFileId}
        expandedFolders={expandedFolders}
        onSelectFolder={(id) => {
          setActiveFileId(null);
          navigateToFolder(id);
        }}
        onSelectFile={(id) => {
          const file = items[id];
          if (file) {
            navigateToFolder(file.parentId);
            setActiveFileId(id);
          }
        }}
        onToggleExpand={toggleFolderExpand}
      />

      {/* Main Content Area */}
      <MainPanel
        items={items}
        selectedFolderId={selectedFolderId}
        activeFileId={activeFileId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNavigate={(id) => {
          setActiveFileId(null);
          navigateToFolder(id);
        }}
        onOpenFile={(id) => {
          setActiveFileId(id);
        }}
        onCloseFile={() => setActiveFileId(null)}
        onCreateAction={handleOpenCreateModal}
        onRenameAction={handleOpenRenameModal}
        onDeleteAction={deleteItem}
        onSaveFileContent={updateFileContent}
        setHasUnsavedChanges={setHasUnsavedChanges}
      />

      {/* Action Modal (Create & Rename) */}
      <ActionModal
        isOpen={isModalOpen}
        mode={modalMode}
        itemType={modalItemType}
        initialValue={targetItem ? targetItem.name : ""}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
