# Prompt Engineering Documentation

This document maintains the current structure of prompts used in the application.

## 1. Article Generation Prompt (`ARTICLE_PROMPT_TEMPLATE`)

Role: **Expert AI Technical Writer**

### Core Components
1.  **Model Information**: Name, Organization, Category, Description, License.
2.  **Input Data**: The full `README.md` content.
3.  **Strict Rules**:
    *   **Source of Truth**: ONLY use information from the README. No hallucinations.
    *   **Length**: ~400-700 words.
    *   **Formatting**: Markdown with specific headers.

### Scoring Generation (New)
The prompt now explicitly instructs the LLM to generate 3 scores (0-100):
*   **Quality Score**: Based on accuracy, benchmarks, and capabilities.
*   **Speed Score**: Based on inference speed, efficiency, and latency.
*   **Freedom Score**: Based on license permissiveness (MIT/Apache > CC-BY > GPL > Closed).

### Metadata Extraction (New)
The prompt explicitly asks for:
*   `safetensors`: Boolean (detection of safetensors format).
*   `model_size`: String (e.g., "7B").
*   `tensor_types`: Array of strings (e.g., ["BF16", "INT8"]).

### SEO & Keywords Strategy
*   **SEO Keywords**: Extracted strictly from valid categories, source types (Open Weights, etc.), and standardized License strings (license:MIT).

---

## 2. LinkedIn Post Prompt (`LINKEDIN_PROMPT_TEMPLATE`)

Role: **Social Media Expert**

### Core Components
1.  **Input**: Model Name, Article Title/Excerpt, Category, Scores.
2.  **Formatting Rules**:
    *   **NO Markdown**: Plain text only.
    *   **Unicode Bolding**: Use mathematical bold characters (e.g., 𝗭-𝗜𝗺𝗮𝗴𝗲).
    *   **Emojis**: Use strictly defined set (✅, ⚡, 🔓).
3.  **Structure**: Hook → Intro → Key Points (Quality/Speed/Freedom) → CTA → Hashtags.
