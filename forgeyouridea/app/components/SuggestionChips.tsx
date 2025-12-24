"use client";

import { motion } from "framer-motion";

interface Suggestion {
    label: string;
    icon?: string;
    colors?: string[];
}

interface SuggestionChipsProps {
    suggestions: (string | Suggestion)[];
    onSelect: (value: string) => void;
    currentValue: string;
}

export default function SuggestionChips({
    suggestions,
    onSelect,
    currentValue,
}: SuggestionChipsProps) {
    return (
        <motion.div
            className="flex flex-wrap gap-2 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            {suggestions.map((suggestion, index) => {
                const isObject = typeof suggestion === "object";
                const label = isObject ? suggestion.label : suggestion;
                const icon = isObject ? suggestion.icon : null;
                const isSelected = currentValue.toLowerCase().includes(label.toLowerCase());

                return (
                    <motion.button
                        key={label}
                        type="button"
                        onClick={() => onSelect(label)}
                        className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
              border transition-all duration-200
              ${isSelected
                                ? "bg-gradient-to-r from-[#8B5CF6]/20 to-[#3B82F6]/20 border-[#8B5CF6]/50 text-white"
                                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20"
                            }
            `}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * index }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {icon && <span>{icon}</span>}
                        <span>{label}</span>
                    </motion.button>
                );
            })}
        </motion.div>
    );
}
