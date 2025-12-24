# 🔥 Idea Forge

<div align="center">

**Transform your raw concepts into professional Website Blueprints powered by AI**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

[Live Demo](#) • [Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture)

</div>

---

## ✨ Features

### 🎯 Smart Form Experience
- **Multi-Step Sequential Form** - Guided 5-step input with Framer Motion animations
- **Smart Suggestions** - Quick-fill chips for audience & feature selection
- **Visual Vibe Selector** - 8 pre-designed brand vibes with color previews
- **Progress Persistence** - Drafts saved to localStorage, resume anytime
- **Clickable Examples** - Real-world examples to inspire input

### 🤖 AI-Powered Generation
- **Google Gemini 2.5 Flash** - Fast, intelligent blueprint generation
- **Real-Time Streaming** - Watch your blueprint generate live
- **Comprehensive Output** - Sitemap, colors, typography, user stories, tech stack

### 🎨 Premium Visual Effects
- **Mouse Spotlight** - Interactive gradient follows cursor
- **Floating Particles** - Ambient star field animation
- **Typewriter Text** - Animated cycling tagline
- **Success Confetti** - Celebration on completion
- **Glassmorphism UI** - Modern translucent card design

### 📦 Powerful Features
- **Download as Markdown** - Export `.md` file for docs
- **Shareable Links** - Generate unique URLs for blueprints
- **History Panel** - View and manage past blueprints
- **Copy to Clipboard** - One-click content copy

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 16 (App Router) | Full-stack React with Edge Runtime |
| **Language** | TypeScript 5 | Type-safe development |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework |
| **Animations** | Framer Motion | Declarative animations |
| **AI** | Google Gemini API | Blueprint generation |
| **Markdown** | react-markdown + remark-gfm | Rich output rendering |
| **Effects** | canvas-confetti | Success celebrations |
| **IDs** | nanoid | Unique shareable link generation |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │   page.tsx  │───▶│ MultiStep   │───▶│  Blueprint  │      │
│  │   (Main)    │    │   Form      │    │   Output    │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
│         │                  │                  │              │
│         ▼                  ▼                  ▼              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │  Background │    │ Suggestion  │    │   History   │      │
│  │  Effects    │    │   Chips     │    │   Panel     │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                     EDGE RUNTIME                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              /api/generate (route.ts)               │    │
│  │  ┌─────────┐    ┌─────────┐    ┌─────────────┐     │    │
│  │  │ Request │───▶│ Gemini  │───▶│  Streaming  │     │    │
│  │  │ Handler │    │  API    │    │  Response   │     │    │
│  │  └─────────┘    └─────────┘    └─────────────┘     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Google Gemini  │
                    │  2.5 Flash API  │
                    └─────────────────┘
```

### Directory Structure

```
forgeyouridea/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # Gemini streaming API endpoint
│   ├── components/
│   │   ├── BackgroundEffects.tsx # Animated gradient orbs
│   │   ├── BlueprintOutput.tsx   # Markdown renderer + actions
│   │   ├── FloatingParticles.tsx # Canvas star field
│   │   ├── HistoryPanel.tsx      # Saved blueprints drawer
│   │   ├── MouseSpotlight.tsx    # Cursor-following gradient
│   │   ├── MultiStepForm.tsx     # Main form component
│   │   ├── SuggestionChips.tsx   # Quick-fill buttons
│   │   ├── TypewriterText.tsx    # Animated tagline
│   │   └── VibeSelector.tsx      # Visual vibe picker
│   ├── utils/
│   │   └── confetti.ts           # Celebration effects
│   ├── globals.css               # Theme & animations
│   ├── layout.tsx                # Root layout + metadata
│   └── page.tsx                  # Main application
├── .env.local                    # API keys (not committed)
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **Google Gemini API Key** - [Get one here](https://aistudio.google.com/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/oezz2003/forgeyouridea.git
cd forgeyouridea

# Install dependencies
npm install

# Create environment file
echo "GOOGLE_GENERATIVE_AI_API_KEY=your_key_here" > .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ Yes | Your Google Gemini API key |

---

## 📋 Usage Guide

### Step 1: Brand Name
Enter your project or company name.

### Step 2: The Big Idea
Describe your core concept in 1-2 sentences. Click "Show examples" for inspiration.

### Step 3: Target Audience
Specify who you're building for. Use suggestion chips for quick selection.

### Step 4: The Vibe
Select a visual style from 8 pre-designed options with color previews:
- 👑 Luxury • 🎈 Playful • ◻️ Minimal • ⚡ Techy
- 🔥 Bold • 🌿 Nature • 🏢 Corporate • 🎨 Creative

### Step 5: Additional Notes
Add any constraints, features, or inspirations (optional).

### Generate!
Click "Forge Blueprint" and watch the AI generate your comprehensive website blueprint.

---

## 📄 Blueprint Output Sections

1. **Executive Summary** - Market positioning & value proposition
2. **Information Architecture** - Detailed sitemap with priorities
3. **Visual Identity** - Color palette, typography, style guidelines
4. **Core User Stories** - 8-10 user journey scenarios
5. **Tech Stack Recommendations** - Framework, hosting, database suggestions
6. **Implementation Roadmap** - Phased development approach

---

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/oezz2003/forgeyouridea)

1. Click the button above
2. Add `GOOGLE_GENERATIVE_AI_API_KEY` in Environment Variables
3. Deploy!

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

## 👤 Author

**Ezzeldeen** - [@oezz2003](https://github.com/oezz2003)

---

<div align="center">

Built with  using Next.js, Tailwind CSS, Framer Motion, and Google Gemini

</div>
