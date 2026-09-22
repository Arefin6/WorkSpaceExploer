export type ItemType = "folder" | "file";

export interface ExplorerItem {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null;
  content?: string; // Only for files
  createdAt: number;
}

export type ExplorerMap = Record<string, ExplorerItem>;
