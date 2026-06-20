import os
import sys

# Ensure virtual environment packages are accessible
print("Python Executable:", sys.executable)
print("System Path:")
for path in sys.path:
    print(f" - {path}")

try:
    from markitdown import MarkItDown
    print("[Success] Successfully imported MarkItDown!")
    
    # Initialize converter
    md = MarkItDown()
    
    # Create a test HTML file
    test_html_path = "test_doc.html"
    with open(test_html_path, "w", encoding="utf-8") as f:
        f.write("<html><body><h1>Hello TD-markitdown</h1><p>This is a <b>test</b> document.</p></body></html>")
        
    print(f"[System] Created test file: {test_html_path}")
    
    # Convert HTML to Markdown
    result = md.convert(test_html_path)
    print("[Success] Conversion completed. Output:")
    print("--------------------------------------------------")
    print(result.text_content.strip())
    print("--------------------------------------------------")
    
    # Clean up test file
    if os.path.exists(test_html_path):
        os.remove(test_html_path)
        print("[System] Cleaned up test HTML file.")
        
    print("[Success] Verification script executed successfully!")
    sys.exit(0)
    
except Exception as e:
    print("[ERROR] Verification failed:", str(e))
    import traceback
    traceback.print_exc()
    sys.exit(1)
