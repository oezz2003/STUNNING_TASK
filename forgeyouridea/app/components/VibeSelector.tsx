"use client";

import { motion } from "framer-motion";

interface VibeOption {
    label: string;
    icon: string;
    colors: [string, string];
    description: string;
}

const vibeOptions: VibeOption[] = [
    {
        label: "Luxury",
        icon: "👑",
        colors: ["#1a1a2e", "#c9a227"],
        description: "Elegant, premium, sophisticated",
    },
    {
        label: "Playful",
        icon: "🎈",
        colors: ["#ff6b6b", "#ffd93d"],
        description: "Fun, energetic, youthful",
    },
    {
        label: "Minimal",
        icon: "◻️",
        colors: ["#f5f5f5", "#1a1a1a"],
        description: "Clean, simple, focused",
    },
    {
        label: "Techy",
        icon: "⚡",
        colors: ["#0f0f0f", "#00ff88"],
        description: "Modern, innovative, cutting-edge",
    },
    {
        label: "Bold",
        icon: "🔥",
        colors: ["#ff0055", "#220011"],
        description: "Striking, confident, memorable",
    },
    {
        label: "Nature",
        icon: "🌿",
        colors: ["#2d5016", "#a8d08d"],
        description: "Organic, calm, sustainable",
    },
    {
        label: "Corporate",
        icon: "🏢",
        colors: ["#1e3a5f", "#e8e8e8"],
        description: "Professional, trustworthy, reliable",
    },
    {
        label: "Creative",
        icon: "🎨",
        colors: ["#8B5CF6", "#ec4899"],
        description: "Artistic, unique, expressive",
    },
];

interface VibeSelectorProps {
    onSelect: (vibe: string) => void;
    selectedVibe: string;
}

export default function VibeSelector({
    onSelect,
    selectedVibe,
}: VibeSelectorProps) {
    return (
        <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            {vibeOptions.map((vibe, index) => {
                const isSelected = selectedVibe.toLowerCase().includes(vibe.label.toLowerCase());

                return (
                    <motion.button
                        key={vibe.label}
                        type="button"
                        onClick={() => onSelect(vibe.label)}
                        className={`
              relative p-4 rounded-xl text-left transition-all duration-300
              border overflow-hidden group
              ${isSelected
                                ? "border-[#8B5CF6] bg-[#8B5CF6]/10"
                                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                            }
            `}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * index }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {/* Color Preview Bar */}
                        <div className="flex gap-1 mb-3">
                            <div
                                className="w-6 h-6 rounded-full border border-white/20"
                                style={{ backgroundColor: vibe.colors[0] }}
                            />
                            <div
                                className="w-6 h-6 rounded-full border border-white/20"
                                style={{ backgroundColor: vibe.colors[1] }}
                            />
                        </div>

                        {/* Icon & Label */}
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{vibe.icon}</span>
                            <span
                                className={`font-medium ${isSelected ? "text-white" : "text-white/80"
                                    }`}
                            >
                                {vibe.label}
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
                            {vibe.description}
                        </p>

                        {/* Selected Indicator */}
                        {isSelected && (
                            <motion.div
                                className="absolute top-2 right-2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                            >
                                <svg
                                    className="w-5 h-5 text-[#8B5CF6]"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </motion.div>
                        )}

                        {/* Hover Gradient Overlay */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                            style={{
                                background: `linear-gradient(135deg, ${vibe.colors[0]}, ${vibe.colors[1]})`,
                            }}
                        />
                    </motion.button>
                );
            })}
        </motion.div>
    );
}
