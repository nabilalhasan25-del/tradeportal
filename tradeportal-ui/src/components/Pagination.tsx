"use client";

import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage?: number;
    totalItems?: number;
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    totalItems,
    className = ""
}) => {
    if (totalPages <= 1) return null;

    // Generate page numbers with ellipses
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 4) pages.push("...");

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (currentPage < totalPages - 3) pages.push("...");
            if (!pages.includes(totalPages)) pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className={`mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-background/50 border border-border/50 p-4 rounded-[2rem] backdrop-blur-sm ${className}`}>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl border border-border hover:bg-muted disabled:opacity-20 disabled:hover:bg-transparent transition-all group"
                >
                    <ChevronRight className="w-4 h-4 text-foreground group-active:-translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-1 px-1">
                    {getPageNumbers().map((page, idx) => (
                        page === "..." ? (
                            <span key={`dots-${idx}`} className="px-3 py-2 text-muted-foreground font-black">...</span>
                        ) : (
                            <button
                                key={`page-${page}`}
                                onClick={() => onPageChange(page as number)}
                                className={`min-w-[40px] h-[40px] rounded-xl text-[11px] font-black transition-all ${currentPage === page
                                    ? "bg-sy-green text-white shadow-lg shadow-sy-green/20 scale-105"
                                    : "bg-muted/50 border border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl border border-border hover:bg-muted disabled:opacity-20 disabled:hover:bg-transparent transition-all group"
                >
                    <ChevronLeft className="w-4 h-4 text-foreground group-active:translate-x-1 transition-transform" />
                </button>
            </div>

            {totalItems !== undefined && (
                <div className="px-6 py-2 bg-muted/30 rounded-full border border-border/30">
                    <p className="text-[10px] font-bold text-muted-foreground">
                        عرض <span className="text-foreground">{(currentPage - 1) * (itemsPerPage || 0) + 1}</span> - <span className="text-foreground">{Math.min(currentPage * (itemsPerPage || 0), totalItems)}</span> من أصل <span className="text-foreground">{totalItems}</span> نتائج
                    </p>
                </div>
            )}
        </div>
    );
};
