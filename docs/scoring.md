# Scoring Methodology Documentation

This document explains how the AI Model scoring system works, how scores are calculated, and what factors influence the final rating.

## Location
The scoring logic is located in: `backend/app/services/scoring_engine.py`

## 1. Overall Score

The overall score (0-100) is a weighted average of three core metrics:

| Metric | Weight | Description |
| :--- | :--- | :--- |
| **Quality Score** | 33.3% | Output quality, accuracy, realism |
| **Speed Score** | 33.3% | Inference speed and efficiency |
| **Freedom Score** | 33.4% | Licensing, cost, accessibility |

Formula:
```python
Overall = (Quality * 0.333) + (Speed * 0.333) + (Freedom * 0.334)
```

## 2. Tier System

Models are assigned a tier letter based on their Overall Score:

| Tier | Score Range | Description |
| :--- | :--- | :--- |
| **S** | 90 - 100 | Exceptional |
| **A** | 80 - 89 | Excellent |
| **B** | 70 - 79 | Good |
| **C** | 60 - 69 | Adequate |
| **D** | 0 - 59 | Limited |

## 3. Detailed Metrics Calculation

### A. Quality Score (0-100)
**Base Score:** 60.0

**Bonus Factors:**
1.  **Quality Keywords (up to +20 points)**
    *   *Keywords*: `state-of-the-art`, `sota`, `best`, `high-quality`, `photorealistic`, `accurate`, `precise`, `excellent`, `superior`, `outperforms`.
    *   *Calculation*: +4 points per keyword found in README/Description.

2.  **Benchmark Mentions (up to +10 points)**
    *   *Keywords*: `benchmark`, `evaluation`, `score`, `fid`, `accuracy`, `bleu`.
    *   *Calculation*: +3 points per keyword match.

3.  **Community Validation (up to +10 points)**
    *   *Calculation*: Based on `log10(likes + 1) * 3`.
    *   *Example*: 1000 likes ≈ 9 points.

### B. Speed Score (0-100)
**Base Score:** 60.0

**Bonus Factors:**
1.  **Speed Keywords (+8 points each)**
    *   *Keywords*: `turbo`, `fast`, `quick`, `efficient`, `lite`, `mini`, `tiny`, `small`.

2.  **Optimization Mentions (+5 points each)**
    *   *Keywords*: `optimized`, `quantized`, `distilled`, `pruned`, `onnx`, `tensorrt`.

3.  **Low Latency Mentions (+6 points each)**
    *   *Keywords*: `sub-second`, `real-time`, `instant`, `low-latency`, `ms`.

### C. Freedom Score (0-100)
**Base Score:** 50.0

**Freedom Factors:**
1.  **License Type**:
    *   **High Freedom (+30 points)**: `mit`, `apache`, `bsd`, `unlicense`, `cc0`, `wtfpl`.
    *   **Medium Freedom (+20 points)**: `cc-by`, `lgpl`, `mpl`.
    *   **Low Freedom (+10 points)**: `gpl`, `agpl`, `cc-by-nc`, `non-commercial`.

2.  **Open Weights (+10 points)**
    *   Detected if tags contain "open" or README mentions "weights".

3.  **Hugging Face Bonus (+10 points)**
    *   Awarded if a Hugging Face URL is present (indicates accessibility).

## 4. Visual Tags

Tags are automatically assigned based on metadata analysis:

- **Open Source** (Green): License is MIT, Apache, BSD, GPL, etc.
- **Open Weights** (Light Green): Weights/Checkpoints are available to download.
- **Free** (Blue): No payment keywords found.
- **Freemium** (Light Blue): Mentions "free tier" or "freemium".
- **Closed / Paid** (Red): Mentions "enterprise", "subscription", etc.

## 5. How to Modify Scoring

To adjust the scoring logic, edit `backend/app/services/scoring_engine.py`.

### Example: Changing Weights
Update the `WEIGHTS` dictionary constants at the top of the file:
```python
WEIGHTS = {
    'quality': 0.50,  # Increased importance
    'speed': 0.25,
    'freedom': 0.25
}
```

### Example: Adding New Keywords
Add strings to the respective list in the calculation functions:
```python
# In _calculate_quality_score
quality_keywords = [..., 'groundbreaking', 'revolutionary']
```
