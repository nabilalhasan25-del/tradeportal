"use client";

import React from "react";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { useTheme } from "next-themes";

interface FilterPopoverProps {
    isOpen: boolean;
    onToggle: () => void;
    onReset: () => void;
    children: React.ReactNode;
    activeFiltersCount?: number;
    className?: string;
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
    isOpen,
    onToggle,
    onReset,
    children,
    activeFiltersCount = 0,
    className = ""
}) => {
    const { theme } = useTheme();

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={onToggle}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border-2 transition-all active:scale-95 group relative ${isOpen
                    ? "bg-sy-green border-sy-green text-white shadow-lg shadow-sy-green/20"
                    : "bg-background border-border hover:border-sy-green/50 hover:bg-muted text-foreground"
                    }`}
            >
                {isOpen ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
                <span className="text-[11px] font-black">تصفية</span>
                {activeFiltersCount > 0 && !isOpen && (
                    <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-sy-red text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-background animate-in zoom-in-50">
                        {activeFiltersCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-16 left-0 z-[60] w-72 bg-card border border-border rounded-[2.5rem] shadow-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-sy-green" />
                            <h4 className="text-[11px] font-black text-foreground">خيارات التصفية</h4>
                        </div>
                        <button
                            onClick={onReset}
                            className="text-[9px] font-black text-sy-red hover:bg-sy-red/5 px-2 py-1 rounded-lg transition-colors"
                        >
                            تصفير الكل
                        </button>
                    </div>

                    <div className="space-y-4">
                        {children}
                    </div>

                    <div className="space-y-1.5 pt-4">
                        <button
                            onClick={onToggle}
                            className="w-full bg-sy-green text-white py-3 rounded-xl text-[10px] font-black shadow-lg shadow-sy-green/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            تطبيق التعديلات
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper component for filter items
export const FilterItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => {
    const { theme } = useTheme();

    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">{label}</label>
            {React.Children.map(children, child => {
                if (React.isValidElement(child) && child.type === 'select') {
                    const selectChild = child as React.ReactElement<React.ComponentPropsWithoutRef<'select'>>;
                    return React.cloneElement(selectChild, {
                        className: `w-full bg-background border border-border rounded-xl px-3 py-2.5 text-[11px] font-bold outline-none focus:ring-2 focus:ring-sy-green/20 disabled:opacity-50 text-foreground transition-colors ${selectChild.props.className || ""}`,
                        style: {
                            colorScheme: theme === 'dark' ? 'dark' : 'light',
                            backgroundColor: 'var(--background)',
                            color: 'var(--foreground)',
                            ...selectChild.props.style
                        }
                    });
                }
                return child;
            })}
        </div>
    );
};
