"use client";

import React from "react";
import { BreadcrumbSegment } from "@/libs/explorerUtils";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbsProps {
  segments: BreadcrumbSegment[];
  onNavigate: (id: string | null) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  segments,
  onNavigate,
}) => {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;

        return (
          <React.Fragment key={segment.id ?? "root"}>
            <button
              onClick={() => {
                if (!isLast) onNavigate(segment.id);
              }}
              className={`flex items-center rounded px-1.5 py-1 transition-colors ${
                isLast
                  ? "font-medium text-gray-900 dark:text-gray-100 cursor-default"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              {segment.id === null && <Home className="w-4 h-4 mr-1.5" />}
              {segment.name}
            </button>

            {/* Separator arrow (except for the last item) */}
            {!isLast && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-0.5" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
