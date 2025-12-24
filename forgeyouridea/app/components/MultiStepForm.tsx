"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, KeyboardEvent, useEffect } from "react";
import SuggestionChips from "./SuggestionChips";
import VibeSelector from "./VibeSelector";

interface FormData {
    brandName: string;
    coreConcept: string;
    targetAudience: string;
    brandVibe: string;
    notes: string;
}

interface MultiStepFormProps {
    onSubmit: (data: FormData) => void;
    isLoading: boolean;
}

interface FieldConfig {
    id: keyof FormData;
    label: string;
    placeholder: string;
    helpText: string;
    icon: string;
    type: "input" | "textarea";
    suggestions?: { label: string; icon?: string }[];
    examples?: string[];
    maxLength?: number;
    optional?: boolean;
    useVibeSelector?: boolean;
}

const formFields: FieldConfig[] = [
    {
        id: "brandName",
        label: "Brand Name",
        placeholder: "e.g., TechFlow, Nomad, Zenith",
        helpText: "Pick something memorable and easy to spell",
        icon: "✨",
        type: "input",
    },
    {
        id: "coreConcept",
        label: "The Big Idea",
        placeholder: "An AI-powered app that helps teams collaborate...",
        helpText: "Describe the core problem you're solving in 1-2 sentences",
        icon: "💡",
        type: "textarea",
        examples: [
            "A platform connecting freelance developers with startups for short-term projects",
            "An AI assistant that summarizes meeting notes and creates action items",
            "A marketplace for indie game developers to sell directly to players",
        ],
        maxLength: 500,
    },
    {
        id: "targetAudience",
        label: "Target Audience",
        placeholder: "Software developers at growing startups",
        helpText: "Be specific about who you're building for",
        icon: "🎯",
        type: "input",
        suggestions: [
            { label: "Developers", icon: "👨‍💻" },
            { label: "Designers", icon: "🎨" },
            { label: "Small Business", icon: "🏪" },
            { label: "Students", icon: "🎓" },
            { label: "Enterprise", icon: "🏢" },
            { label: "Creators", icon: "📹" },
        ],
    },
    {
        id: "brandVibe",
        label: "The Vibe",
        placeholder: "Select a vibe or describe your own...",
        helpText: "How should your brand feel to visitors?",
        icon: "🎨",
        type: "input",
        useVibeSelector: true,
    },
    {
        id: "notes",
        label: "Additional Notes",
        placeholder: "Dark mode required, integrate with Stripe...",
        helpText: "Any specific features, constraints, or inspirations",
        icon: "📝",
        type: "textarea",
        suggestions: [
            { label: "Dark mode" },
            { label: "Mobile-first" },
            { label: "E-commerce" },
            { label: "User auth" },
            { label: "Dashboard" },
            { label: "Analytics" },
        ],
        optional: true,
        maxLength: 300,
    },
];

const STORAGE_KEY = "ideaforge_draft";

export default function MultiStepForm({
    onSubmit,
    isLoading,
}: MultiStepFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        brandName: "",
        coreConcept: "",
        targetAudience: "",
        brandVibe: "",
        notes: "",
    });
    const [showExample, setShowExample] = useState(false);
    const [hasSavedDraft, setHasSavedDraft] = useState(false);

    // Load saved draft on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.brandName || parsed.coreConcept) {
                    setHasSavedDraft(true);
                }
            } catch {
                // Invalid saved data
            }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (formData.brandName || formData.coreConcept) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        }
    }, [formData]);

    const restoreDraft = () => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setFormData(JSON.parse(saved));
            setHasSavedDraft(false);
        }
    };

    const clearDraft = () => {
        localStorage.removeItem(STORAGE_KEY);
        setHasSavedDraft(false);
    };

    const currentField = formFields[currentStep];
    const isLastStep = currentStep === formFields.length - 1;
    const canProceed =
        currentField.optional ||
        formData[currentField.id].trim() !== "";

    const handleChange = useCallback(
        (value: string) => {
            if (currentField.maxLength && value.length > currentField.maxLength) {
                return;
            }
            setFormData((prev) => ({
                ...prev,
                [currentField.id]: value,
            }));
        },
        [currentField.id, currentField.maxLength]
    );

    const handleSuggestionSelect = (value: string) => {
        const currentValue = formData[currentField.id];
        if (currentField.type === "input") {
            // Replace entire value for single inputs
            handleChange(value);
        } else {
            // Append for textareas/notes
            const newValue = currentValue ? `${currentValue}, ${value}` : value;
            handleChange(newValue);
        }
    };

    const handleNext = useCallback(() => {
        if (canProceed) {
            if (isLastStep) {
                localStorage.removeItem(STORAGE_KEY);
                onSubmit(formData);
            } else {
                setCurrentStep((prev) => prev + 1);
                setShowExample(false);
            }
        }
    }, [canProceed, isLastStep, formData, onSubmit]);

    const handleBack = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
            setShowExample(false);
        }
    }, [currentStep]);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey && currentField.type !== "textarea") {
            e.preventDefault();
            handleNext();
        }
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleNext();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Resume Draft Banner */}
            <AnimatePresence>
                {hasSavedDraft && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        className="mb-6 p-4 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">📝</span>
                            <span className="text-white/80">
                                Continue where you left off?
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={restoreDraft}
                                className="px-4 py-2 rounded-lg bg-[#8B5CF6] text-white text-sm font-medium hover:bg-[#7c4ee4] transition-colors"
                            >
                                Resume
                            </button>
                            <button
                                onClick={clearDraft}
                                className="px-4 py-2 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-white/10 hover:text-white transition-colors"
                            >
                                Start Fresh
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Indicator */}
            <div className="flex justify-center gap-2 mb-6">
                {formFields.map((field, index) => (
                    <motion.button
                        key={field.id}
                        onClick={() => index < currentStep && setCurrentStep(index)}
                        disabled={index > currentStep}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentStep
                                ? "w-10 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]"
                                : index < currentStep
                                    ? "w-4 bg-[#8B5CF6] cursor-pointer hover:bg-[#9d6ff7]"
                                    : "w-4 bg-white/10"
                            }`}
                        initial={false}
                        animate={{ scale: index === currentStep ? 1.1 : 1 }}
                        aria-label={`Step ${index + 1}: ${field.label}`}
                    />
                ))}
            </div>

            {/* Step Counter & Help */}
            <div className="flex items-center justify-between mb-4 px-2">
                <motion.p
                    className="text-white/40 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Step {currentStep + 1} of {formFields.length}
                    {currentField.optional && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-white/5 text-white/30 text-xs">
                            Optional
                        </span>
                    )}
                </motion.p>
            </div>

            {/* Form Field */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="glass-card p-8 md:p-10"
                >
                    {/* Label with Icon */}
                    <motion.div
                        className="flex items-center gap-3 mb-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <span className="text-2xl">{currentField.icon}</span>
                        <label className="text-2xl md:text-3xl font-semibold gradient-text">
                            {currentField.label}
                        </label>
                    </motion.div>

                    {/* Help Text */}
                    <motion.p
                        className="text-white/40 text-sm mb-6 ml-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                    >
                        {currentField.helpText}
                    </motion.p>

                    {/* Input Field */}
                    {currentField.type === "textarea" ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <textarea
                                autoFocus
                                value={formData[currentField.id]}
                                onChange={(e) => handleChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={currentField.placeholder}
                                rows={4}
                                className="w-full text-lg bg-transparent border-b-2 border-white/10 focus:border-[#8B5CF6] transition-colors py-4 resize-none placeholder:text-white/30 outline-none"
                                aria-label={currentField.label}
                                aria-describedby={`${currentField.id}-help`}
                            />
                            {currentField.maxLength && (
                                <div className="flex justify-end mt-2">
                                    <span
                                        className={`text-xs ${formData[currentField.id].length > currentField.maxLength * 0.9
                                                ? "text-amber-400"
                                                : "text-white/30"
                                            }`}
                                    >
                                        {formData[currentField.id].length}/{currentField.maxLength}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.input
                            autoFocus
                            type="text"
                            value={formData[currentField.id]}
                            onChange={(e) => handleChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={currentField.placeholder}
                            className="w-full text-lg md:text-xl bg-transparent border-b-2 border-white/10 focus:border-[#8B5CF6] transition-colors py-4 placeholder:text-white/30 outline-none"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            aria-label={currentField.label}
                            aria-describedby={`${currentField.id}-help`}
                        />
                    )}

                    {/* Vibe Selector */}
                    {currentField.useVibeSelector && (
                        <VibeSelector
                            onSelect={handleSuggestionSelect}
                            selectedVibe={formData.brandVibe}
                        />
                    )}

                    {/* Suggestion Chips */}
                    {currentField.suggestions && !currentField.useVibeSelector && (
                        <SuggestionChips
                            suggestions={currentField.suggestions}
                            onSelect={handleSuggestionSelect}
                            currentValue={formData[currentField.id]}
                        />
                    )}

                    {/* Examples */}
                    {currentField.examples && (
                        <motion.div
                            className="mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <button
                                type="button"
                                onClick={() => setShowExample(!showExample)}
                                className="text-sm text-[#8B5CF6] hover:text-[#9d6ff7] transition-colors flex items-center gap-1"
                            >
                                <span>{showExample ? "Hide" : "Show"} examples</span>
                                <svg
                                    className={`w-4 h-4 transform transition-transform ${showExample ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                            <AnimatePresence>
                                {showExample && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-3 space-y-2"
                                    >
                                        {currentField.examples.map((example, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => handleChange(example)}
                                                className="block w-full text-left p-3 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                                            >
                                                "{example}"
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Keyboard Hint */}
                    <motion.p
                        className="text-white/30 text-sm mt-6 flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                    >
                        <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs">
                            {currentField.type === "textarea" ? "Ctrl+Enter" : "Enter"}
                        </kbd>
                        <span>to continue</span>
                    </motion.p>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.div
                className="flex justify-between items-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${currentStep === 0
                            ? "opacity-0 pointer-events-none"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                    aria-label="Go back to previous step"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed || isLoading}
                    className="btn-primary flex items-center gap-2"
                    aria-label={isLastStep ? "Generate blueprint" : "Continue to next step"}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            Forging...
                        </>
                    ) : isLastStep ? (
                        <>
                            Forge Blueprint
                            <span>✨</span>
                        </>
                    ) : (
                        <>
                            Continue
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </>
                    )}
                </button>
            </motion.div>
        </div>
    );
}
