"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MultiStepForm from "./components/MultiStepForm";
import BlueprintOutput from "./components/BlueprintOutput";
import BackgroundEffects from "./components/BackgroundEffects";
import MouseSpotlight from "./components/MouseSpotlight";
import FloatingParticles from "./components/FloatingParticles";
import TypewriterText from "./components/TypewriterText";
import HistoryPanel from "./components/HistoryPanel";
import { triggerConfetti } from "./utils/confetti";

interface FormData {
  brandName: string;
  coreConcept: string;
  targetAudience: string;
  brandVibe: string;
  notes: string;
}

interface SavedBlueprint {
  id: string;
  brandName: string;
  content: string;
  createdAt: number;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brandName, setBrandName] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const hasTriggeredConfetti = useRef(false);

  // Load blueprint from URL if shared
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const blueprintId = params.get("blueprint");
    if (blueprintId) {
      const saved = localStorage.getItem("ideaforge_blueprints");
      if (saved) {
        const blueprints: SavedBlueprint[] = JSON.parse(saved);
        const found = blueprints.find((b) => b.id === blueprintId);
        if (found) {
          setOutput(found.content);
          setBrandName(found.brandName);
          setShowOutput(true);
        }
      }
    }
  }, []);

  // Trigger confetti when generation completes
  useEffect(() => {
    if (!isLoading && output && !hasTriggeredConfetti.current) {
      hasTriggeredConfetti.current = true;
      triggerConfetti();
    }
  }, [isLoading, output]);

  // Scroll to output when it appears
  useEffect(() => {
    if (showOutput && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showOutput]);

  const handleSubmit = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setOutput("");
    setShowOutput(true);
    setBrandName(formData.brandName);
    hasTriggeredConfetti.current = false;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate blueprint");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setOutput((prev) => prev + chunk);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setShowOutput(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleHistorySelect = (blueprint: SavedBlueprint) => {
    setOutput(blueprint.content);
    setBrandName(blueprint.brandName);
    setShowOutput(true);
    setIsHistoryOpen(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Layers */}
      <BackgroundEffects />
      <FloatingParticles />
      <MouseSpotlight />

      {/* History Button */}
      <motion.button
        onClick={() => setIsHistoryOpen(true)}
        className="fixed top-4 right-4 z-30 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <svg
          className="w-5 h-5 text-white/60 group-hover:text-white transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </motion.button>

      {/* History Panel */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={handleHistorySelect}
      />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <AnimatePresence mode="wait">
          {!showOutput ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              {/* Hero Section */}
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] animate-pulse" />
                  <span className="text-sm text-white/60">
                    AI-Powered Blueprint Generator
                  </span>
                </motion.div>

                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  <span className="gradient-text">Idea Forge</span>
                </h1>

                <p className="text-lg md:text-xl text-white/50 max-w-lg mx-auto">
                  Transform your raw concepts into
                </p>
                <div className="h-10 md:h-12 flex items-center justify-center mt-2">
                  <TypewriterText />
                </div>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <MultiStepForm onSubmit={handleSubmit} isLoading={isLoading} />
            </motion.div>
          ) : (
            <motion.div
              key="output"
              ref={outputRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              {/* Back Button */}
              <motion.div
                className="max-w-4xl mx-auto mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <button
                  onClick={() => {
                    setShowOutput(false);
                    setOutput("");
                    hasTriggeredConfetti.current = false;
                    // Clear URL params
                    window.history.replaceState({}, "", window.location.pathname);
                  }}
                  className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
                >
                  <svg
                    className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Form
                </button>
              </motion.div>

              <BlueprintOutput content={output} isStreaming={isLoading} brandName={brandName} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          className="absolute bottom-6 text-center text-white/30 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Built by{" "}
          <a
            href="https://github.com/oezz2003"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors"
          >
            Ezzeldeen
          </a>
        </motion.footer>
      </main>
    </div>
  );
}
