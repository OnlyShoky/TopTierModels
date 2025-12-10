
import json

invalid_json = """
{
  "title": "Test",
  "content": "Line 1
Line 2"
}
"""

print(f"Testing invalid JSON length: {len(invalid_json)}")

try:
    print("Trying strict=True (default)...")
    json.loads(invalid_json)
    print("Success!")
except Exception as e:
    print(f"Failed: {e}")

try:
    print("Trying strict=False...")
    obj = json.loads(invalid_json, strict=False)
    print(f"Success! Content: {repr(obj['content'])}")
except Exception as e:
    print(f"Failed: {e}")
