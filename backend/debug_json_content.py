import json
import re

file_path = 'output/z-image-turbo-fast-photorealistic-ai-art.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

content = data.get('article_data', {}).get('content', '')

print(f"Content length: {len(content)}")

# Find all occurrences of ```
matches = list(re.finditer(r'```', content))

print(f"Found {len(matches)} code fences.")

for i, match in enumerate(matches):
    start = max(0, match.start() - 10)
    end = min(len(content), match.start() + 50)
    snippet = content[start:end]
    print(f"\n--- Match {i+1} at index {match.start()} ---")
    print(f"Snippet (repr): {repr(snippet)}")
    
    # Check what follows
    following = content[match.end():match.end()+20]
    print(f"Immediately following (repr): {repr(following)}")

# Test the fix function
def fix_markdown_code_blocks(content: str) -> str:
    if not content:
        return content
    # Fix double newlines after code fence
    return re.sub(r'```(\w+)\n\n', r'```\1\n', content)

fixed = fix_markdown_code_blocks(content)
if fixed != content:
    print("\n✅ Fix function WOULD modify content.")
    # Show diff
    import difflib
    print("Diff:")
    print(''.join(difflib.context_diff(content.splitlines(keepends=True), fixed.splitlines(keepends=True))))
else:
    print("\n❌ Fix function would NOT change anything (regex didn't match).")
