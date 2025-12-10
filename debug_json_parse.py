
import json
import re

def _parse_json_response(response: str):
    """Parse JSON from LLM response, handling markdown code fences."""
    print(f"DEBUG: Input length: {len(response)}")
    
    # Try direct JSON parse first
    try:
        return json.loads(response)
    except json.JSONDecodeError as e:
        print(f"DEBUG: Direct parse failed: {e}")
    
    # Try to extract JSON from markdown code fence
    patterns = [
        r'```json\s*([\s\S]*?)\s*```',  # ```json ... ```
        r'```\s*([\s\S]*?)\s*```',       # ``` ... ```
        r'\{[\s\S]*\}'                   # Raw JSON object
    ]
    
    for i, pattern in enumerate(patterns):
        match = re.search(pattern, response)
        if match:
            print(f"DEBUG: Matched pattern {i}")
            try:
                json_str = match.group(1) if '```' in pattern else match.group(0)
                # Cleanup potential issues
                json_str = json_str.strip()
                return json.loads(json_str)
            except (json.JSONDecodeError, IndexError) as e:
                print(f"DEBUG: Pattern {i} parse failed: {e}")
                continue
    
    print("DEBUG: All patterns failed")
    return None

# Simulation of what the user is likely seeing (based on the snippet)
# The snippet showed a valid looking JSON. 
# Let's try with a string that has newlines in the content field which is a common failure point.

sample_response = """
Here is the analysis:

```json
{
  "title": "DeepSeek-V3.2: Analysis",
  "slug": "deepseek-v3-2",
  "excerpt": "A short excerpt.",
  "content": "DeepSeek-V3.2 is a model.\n\n### Executive Summary\nIt is good."
}
```
"""

print("--- TEST 1: Correctly escaped newlines ---")
result = _parse_json_response(sample_response)
print(f"Result 1: {'Success' if result else 'Failure'}")

# Test 2: Unescaped newlines (common LLM error)
sample_response_2 = """
```json
{
  "title": "DeepSeek-V3.2: Analysis",
  "content": "DeepSeek-V3.2 is a model.

### Executive Summary
It is good."
}
```
"""

print("\n--- TEST 2: Unescaped newlines (Multine string) ---")
result_2 = _parse_json_response(sample_response_2)
print(f"Result 2: {'Success' if result_2 else 'Failure'}")
