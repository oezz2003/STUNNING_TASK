import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are a Senior Product Architect & UX Strategist. Your task is to transform raw project ideas into comprehensive, professional Website Blueprints (Software Requirements Specifications).

When given a JSON input containing:
- brandName: The name of the brand/project
- coreConcept: The core idea or vision
- targetAudience: Who the product is for
- brandVibe: The desired aesthetic/emotional tone
- notes: Additional context, features, or constraints

You must generate a detailed Website Blueprint in Markdown format with the following sections:

# 🚀 Website Blueprint: [Brand Name]

## 1. Executive Summary & Market Positioning
- Brief overview of the project
- Unique value proposition
- Market opportunity analysis
- Competitive positioning strategy

## 2. Information Architecture (Sitemap)
Create a detailed sitemap table:
| Page | Purpose | Priority | Key Components |
|------|---------|----------|----------------|

Include all essential pages: Home, About, Services/Products, Contact, etc.

## 3. Visual Identity Guidelines
### Color Palette
| Name | Hex Code | Usage |
|------|----------|-------|

### Typography
- Primary Font: [Recommendation with Google Fonts link]
- Secondary Font: [Recommendation]
- Use cases for each

### Visual Style Notes
- Design principles aligned with brand vibe
- Imagery guidelines
- Iconography style

## 4. Core User Stories
Format each as: "As a [user type], I want to [action] so that [benefit]."
Group by user type or feature area. Include at least 8-10 user stories.

## 5. Recommended Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|

Include recommendations for:
- Frontend Framework
- Styling Solution
- Backend/API
- Database (if applicable)
- Hosting/Deployment
- Analytics & SEO

## 6. Implementation Roadmap
Suggest a phased approach with MVP features first.

---

Format everything beautifully with proper Markdown. Use tables, bullet points, and clear headings. Be specific and actionable. Ensure all recommendations align with the brand vibe and target audience.`;

interface RequestBody {
    brandName: string;
    coreConcept: string;
    targetAudience: string;
    brandVibe: string;
    notes: string;
}

export async function POST(request: Request) {
    try {
        const body: RequestBody = await request.json();

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            return new Response(
                JSON.stringify({
                    error:
                        "API key not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables.",
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: SYSTEM_PROMPT,
        });

        const userPrompt = `Generate a comprehensive Website Blueprint for the following project:

\`\`\`json
${JSON.stringify(body, null, 2)}
\`\`\`

Please provide a detailed, professional, and actionable blueprint that aligns with the brand's vision and target audience.`;

        const result = await model.generateContentStream(userPrompt);

        // Create a readable stream from the response with abort handling
        const encoder = new TextEncoder();
        let isCancelled = false;

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        // Check if stream was cancelled
                        if (isCancelled) {
                            break;
                        }
                        const text = chunk.text();
                        if (text) {
                            controller.enqueue(encoder.encode(text));
                        }
                    }
                    if (!isCancelled) {
                        controller.close();
                    }
                } catch (error: unknown) {
                    // Gracefully handle abort errors
                    if (error instanceof Error && error.name === 'AbortError') {
                        console.log('Stream aborted by client');
                    } else if (!isCancelled) {
                        console.error('Stream error:', error);
                        controller.error(error);
                    }
                }
            },
            cancel() {
                isCancelled = true;
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (error) {
        console.error("Error generating blueprint:", error);
        return new Response(
            JSON.stringify({
                error: "Failed to generate blueprint. Please try again.",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
