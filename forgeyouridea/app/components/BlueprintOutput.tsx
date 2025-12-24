"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useRef } from "react";
import { nanoid } from "nanoid";

interface BlueprintOutputProps {
    content: string;
    isStreaming: boolean;
    brandName?: string;
}

interface SavedBlueprint {
    id: string;
    brandName: string;
    content: string;
    createdAt: number;
}

export default function BlueprintOutput({
    content,
    isStreaming,
    brandName = "blueprint",
}: BlueprintOutputProps) {
    const [copied, setCopied] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [showShareTooltip, setShowShareTooltip] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        // Create markdown file download
        const blob = new Blob([content], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${brandName.toLowerCase().replace(/\s+/g, "-")}-blueprint.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleShare = async () => {
        // Save to localStorage with unique ID
        const id = nanoid(10);
        const savedBlueprint: SavedBlueprint = {
            id,
            brandName,
            content,
            createdAt: Date.now(),
        };

        // Get existing blueprints
        const existing = localStorage.getItem("ideaforge_blueprints");
        const blueprints: SavedBlueprint[] = existing ? JSON.parse(existing) : [];
        blueprints.unshift(savedBlueprint);

        // Keep only last 10
        if (blueprints.length > 10) {
            blueprints.pop();
        }

        localStorage.setItem("ideaforge_blueprints", JSON.stringify(blueprints));

        // Copy share URL
        const shareUrl = `${window.location.origin}?blueprint=${id}`;
        await navigator.clipboard.writeText(shareUrl);
        setLinkCopied(true);
        setShowShareTooltip(true);
        setTimeout(() => {
            setLinkCopied(false);
            setShowShareTooltip(false);
        }, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <motion.div
                        className="w-3 h-3 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]"
                        animate={
                            isStreaming
                                ? {
                                    scale: [1, 1.2, 1],
                                    opacity: [1, 0.7, 1],
                                }
                                : {}
                        }
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <h2 className="text-xl font-semibold gradient-text">
                        {isStreaming ? "Forging Blueprint..." : "Your Website Blueprint"}
                    </h2>
                </div>

                {/* Action Buttons */}
                {!isStreaming && content && (
                    <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        {/* Copy Button */}
                        <motion.button
                            onClick={handleCopy}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-white/70"
                        >
                            {copied ? (
                                <>
                                    <svg
                                        className="w-4 h-4 text-green-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Copy
                                </>
                            )}
                        </motion.button>

                        {/* Download Button */}
                        <motion.button
                            onClick={handleDownload}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-white/70"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            Download
                        </motion.button>

                        {/* Share Button */}
                        <div className="relative">
                            <motion.button
                                onClick={handleShare}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#8B5CF6]/20 to-[#3B82F6]/20 hover:from-[#8B5CF6]/30 hover:to-[#3B82F6]/30 border border-[#8B5CF6]/30 transition-colors text-sm text-white"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                    />
                                </svg>
                                Share
                            </motion.button>
                            {/* Tooltip */}
                            {showShareTooltip && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute top-full mt-2 right-0 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-xs whitespace-nowrap"
                                >
                                    Link copied to clipboard!
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Content */}
            <div ref={contentRef} className="glass-card p-8 md:p-12 overflow-hidden">
                {content ? (
                    <motion.div
                        className="markdown-output"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <div className="skeleton h-8 w-3/4" />
                        <div className="skeleton h-4 w-full" />
                        <div className="skeleton h-4 w-5/6" />
                        <div className="skeleton h-4 w-4/5" />
                        <div className="skeleton h-24 w-full mt-6" />
                        <div className="skeleton h-4 w-full" />
                        <div className="skeleton h-4 w-3/4" />
                    </div>
                )}

                {/* Streaming cursor */}
                {isStreaming && content && (
                    <motion.span
                        className="inline-block w-2 h-5 bg-[#8B5CF6] ml-1"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    />
                )}
            </div>

            {/* Footer Actions */}
            {!isStreaming && content && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center gap-4 mt-8"
                >
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 rounded-xl font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Start New Blueprint
                    </button>

                    <p className="text-white/30 text-sm">
                        Your blueprint has been saved and can be shared!
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
}
