"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const phrases = [
    "professional website blueprints",
    "actionable technical specs",
    "stunning visual identities",
    "comprehensive sitemaps",
    "modern tech stacks",
];

export default function TypewriterText() {
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const currentPhrase = useMemo(
        () => phrases[currentPhraseIndex],
        [currentPhraseIndex]
    );

    useEffect(() => {
        const typeSpeed = isDeleting ? 30 : 50;
        const pauseTime = isDeleting ? 50 : 2000;

        if (!isDeleting && displayedText === currentPhrase) {
            // Pause at end of phrase
            const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
            return () => clearTimeout(timeout);
        }

        if (isDeleting && displayedText === "") {
            // Move to next phrase
            setIsDeleting(false);
            setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
            return;
        }

        const timeout = setTimeout(() => {
            if (isDeleting) {
                setDisplayedText((prev) => prev.slice(0, -1));
            } else {
                setDisplayedText((prev) => currentPhrase.slice(0, prev.length + 1));
            }
        }, typeSpeed);

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, currentPhrase]);

    return (
        <span className="inline-flex items-center">
            <span className="gradient-text">{displayedText}</span>
            <motion.span
                className="inline-block w-[3px] h-8 md:h-10 bg-[#8B5CF6] ml-1"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
            />
        </span>
    );
}
