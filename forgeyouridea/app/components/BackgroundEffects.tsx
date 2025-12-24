"use client";

import { motion } from "framer-motion";

export default function BackgroundEffects() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {/* Primary Purple Orb */}
            <motion.div
                className="bg-glow-orb w-[600px] h-[600px] -top-[200px] -left-[200px]"
                style={{ background: "rgba(139, 92, 246, 0.15)" }}
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Secondary Blue Orb */}
            <motion.div
                className="bg-glow-orb w-[500px] h-[500px] top-1/2 -right-[150px]"
                style={{ background: "rgba(59, 130, 246, 0.12)" }}
                animate={{
                    x: [0, -40, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Bottom Purple Orb */}
            <motion.div
                className="bg-glow-orb w-[400px] h-[400px] -bottom-[100px] left-1/3"
                style={{ background: "rgba(139, 92, 246, 0.1)" }}
                animate={{
                    x: [0, 60, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Grid Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Radial Gradient Vignette */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)",
                }}
            />

            {/* Noise Texture */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
}
