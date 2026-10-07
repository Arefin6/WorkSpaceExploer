import { ExplorerItem, ExplorerMap } from "@/types/explorer";

export function getChildren(
  items: ExplorerMap,
  parentId: string | null,
): ExplorerItem[] {
  return Object.values(items)
    .filter((item) => item.parentId === parentId)
    .sort((a, b) => {
      // Folders first
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1;
      }
      // Alphabetical order
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });
}


export interface BreadcrumbSegment {
  id: string | null;
  name: string;
}

export function getBreadcrumbs(
  items: ExplorerMap,
  currentFolderId: string | null,
): BreadcrumbSegment[] {
  const crumbs: BreadcrumbSegment[] = [];
  let currId: string | null = currentFolderId;

  // Traverse upwards using parentId
  while (currId && items[currId]) {
    const item = items[currId];
    crumbs.unshift({ id: item.id, name: item.name });
    currId = item.parentId;
  }

  // Always prepend Root ("Workspace")
  crumbs.unshift({ id: null, name: "Workspace" });
  return crumbs;
}


export function validateName(
  items: ExplorerMap,
  parentId: string | null,
  name: string,
  currentItemId?: string, // Passed when renaming to ignore self
): string | null {
  const trimmed = name.trim();

  if (!trimmed) {
    return "Name cannot be empty.";
  }

  // Check for forbidden characters (optional but good practice)
  if (/[\\/:*?"<>|]/.test(trimmed)) {
    return 'Name contains invalid characters (\\ / : * ? " < > |)';
  }

  // Check for duplicates in the same parent folder (case-insensitive)
  const isDuplicate = Object.values(items).some(
    (item) =>
      item.parentId === parentId &&
      item.id !== currentItemId &&
      item.name.toLowerCase() === trimmed.toLowerCase(),
  );

  if (isDuplicate) {
    return `An item named "${trimmed}" already exists in this folder.`;
  }

  return null; // Valid
}


export function getAllDescendantIds(
  items: ExplorerMap,
  folderId: string,
): string[] {
  let idsToDelete: string[] = [folderId];

  const children = Object.values(items).filter(
    (item) => item.parentId === folderId,
  );
  for (const child of children) {
    if (child.type === "folder") {
      idsToDelete = idsToDelete.concat(getAllDescendantIds(items, child.id));
    } else {
      idsToDelete.push(child.id);
    }
  }

  return idsToDelete;
}


export function deleteItemRecursive(
  items: ExplorerMap,
  idToDelete: string,
): ExplorerMap {
  const idsToRemove = new Set(getAllDescendantIds(items, idToDelete));
  const newMap: ExplorerMap = {};

  for (const [id, item] of Object.entries(items)) {
    if (!idsToRemove.has(id)) {
      newMap[id] = item;
    }
  }

  return newMap;
}


export function searchWorkspace(
  items: ExplorerMap,
  query: string,
): ExplorerItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return Object.values(items).filter((item) =>
    item.name.toLowerCase().includes(q),
  );
}
