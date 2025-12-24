"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SavedBlueprint {
    id: string;
    brandName: string;
    content: string;
    createdAt: number;
}

interface HistoryPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (blueprint: SavedBlueprint) => void;
}

export default function HistoryPanel({
    isOpen,
    onClose,
    onSelect,
}: HistoryPanelProps) {
    const [blueprints, setBlueprints] = useState<SavedBlueprint[]>([]);

    useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem("ideaforge_blueprints");
            if (saved) {
                setBlueprints(JSON.parse(saved));
            }
        }
    }, [isOpen]);

    const handleDelete = (id: string) => {
        const updated = blueprints.filter((b) => b.id !== id);
        setBlueprints(updated);
        localStorage.setItem("ideaforge_blueprints", JSON.stringify(updated));
    };

    const formatDate = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">📚</span>
                                <h2 className="text-lg font-semibold text-white">Blueprint History</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5 text-white/60"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {blueprints.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <span className="text-4xl mb-4">🔮</span>
                                    <p className="text-white/60 mb-2">No blueprints yet</p>
                                    <p className="text-white/40 text-sm">
                                        Your generated blueprints will appear here
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {blueprints.map((blueprint, index) => (
                                        <motion.div
                                            key={blueprint.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                                            onClick={() => onSelect(blueprint)}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-medium text-white group-hover:text-[#8B5CF6] transition-colors">
                                                    {blueprint.brandName || "Untitled"}
                                                </h3>
                                                <span className="text-xs text-white/40">
                                                    {formatDate(blueprint.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-white/50 line-clamp-2">
                                                {blueprint.content.slice(0, 150)}...
                                            </p>
                                            <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSelect(blueprint);
                                                    }}
                                                    className="px-3 py-1 text-xs rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#8B5CF6]/30 transition-colors"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(blueprint.id);
                                                    }}
                                                    className="px-3 py-1 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {blueprints.length > 0 && (
                            <div className="p-4 border-t border-white/10">
                                <p className="text-center text-white/40 text-xs">
                                    {blueprints.length} blueprint{blueprints.length !== 1 ? "s" : ""} saved
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
