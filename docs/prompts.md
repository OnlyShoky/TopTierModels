# Prompt Engineering Documentation

This document explains how prompts are constructed for generating Articles and LinkedIn posts in the application.

## Location
The prompt logic is located in: `backend/app/services/llm_processor.py`

## 1. Article Generation Prompt

**Template Name:** `ARTICLE_PROMPT_TEMPLATE`

### Structure
The prompt instructs the AI to act as an "expert AI technical writer" and generate a technical blog article based on provided model information. It enforces a JSON output format containing the title, slug, excerpt, content (markdown), SEO keywords, and read time.

### Current Parameters
The following parameters are currently injected into the prompt:

- `{model_name}`: The display name of the AI model.
- `{organization}`: The organization that created the model (or "Unknown").
- `{category}`: The category of the model (e.g., "Computer Vision", "NLP").
- `{description}`: A description of the model.
- `{readme_content}`: The first 8000 characters of the model's README file.

### Required Sections
The prompt explicitly asks for:
1. Executive Summary
2. Model Architecture Overview
3. Key Features and Innovations
4. Performance Analysis
5. Use Cases and Applications
6. Implementation Guidance
7. Conclusion and Recommendations

## 2. LinkedIn Post Generation Prompt

**Template Name:** `LINKEDIN_PROMPT_TEMPLATE`

### Structure
The prompt instructs the AI to create a LinkedIn-optimized post about the analyzed model. It specifies critical formatting rules (no markdown, unicode bolding, emojis) to ensure the output is ready to paste into LinkedIn.

### Current Parameters
- `{model_name}`: The name of the model.
- `{article_title}`: The title of the generated article.
- `{article_excerpt}`: The short excerpt/summary of the article.
- `{category}`: The model category.
- `{overall_score}`: Calculated overall score (0-100).
- `{quality_score}`: Calculated quality score.
- `{speed_score}`: Calculated speed score.
- `{freedom_score}`: Calculated freedom score.

## 3. How to Modify Prompts

To modify the prompts, look for `ARTICLE_PROMPT_TEMPLATE` or `LINKEDIN_PROMPT_TEMPLATE` in `backend/app/services/llm_processor.py`.

### Example: changing the Article Tone
You can change the first line:
```python
ARTICLE_PROMPT_TEMPLATE = """You are a witty and sarcastic tech blogger..."""
```

### Example: Adding New Parameters
1. **Update the TemplateString:**
   Add a placeholder like `{target_audience}` in the prompt text.
   ```python
   ARTICLE_PROMPT_TEMPLATE = """... write for a {target_audience} audience ..."""
   ```

2. **Update the python function:**
   Update the `generate_article` function in `llm_processor.py` to pass the new value.
   ```python
   prompt = ARTICLE_PROMPT_TEMPLATE.format(
       ...,
       target_audience="senior data scientists", # Add your parameter here
   )
   ```

## 4. Potential Custom Parameters (Ideas for Tweaking)

These are parameters that are **not currently used** but could be easily added to customize the output:

### For Articles:
- **`{tone}`**:  Control the writing style.
  - *Values*: `Formal`, `Casual`, `Academic`, `Enthusiastic`.
- **`{target_audience}`**: Adjust the technical depth.
  - *Values*: `Beginner`, `Developer`, `Researcher`, `CTO`.
- **`{word_count_range}`**: Dynamically adjust length requirements.
  - *Values*: `500-800`, `1500-2000`.
- **`{language}`**: Enforce output language (currently English defaults).
  - *Values*: `Spanish`, `French`, `German`.
- **`{focus_area}`**: Tell the AI to focus on a specific aspect.
  - *Values*: `Cost efficiency`, `Performance`, `Ease of use`.

### For LinkedIn Posts:
- **`{virality_level}`**: Instructions on how clickbaity the hook should be.
  - *Values*: `Professional`, `Viral`, `Controversial`.
- **`{emoji_style}`**: Control emoji usage density.
  - *Values*: `Minimal`, `Heavy`, `None`.
- **`{call_to_action_type}`**: Vary the CTA.
  - *Values*: `Question`, `Link-focused`, `Comment-focused`.
