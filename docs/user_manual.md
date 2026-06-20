# TD-markitdown User Manual 📖

Welcome to TD-markitdown! This guide will walk you through setting up and using the application to convert files into Markdown (.md) documents.

---

## 1. Quick Start

1. **Launch the Application**: Run `run.bat` by double-clicking it. The app will install any missing dependencies and automatically launch in your default web browser at `http://127.0.0.1:8000`.
2. **Add Files**: 
   - Click the **Choose Files** button to open the native Windows file dialogue.
   - Select one or more files (you can select files of different formats at the same time).
   - They will appear in the **Conversion Queue**.
3. **Choose Output Location**:
   - **Same Folder**: Generates the `.md` file in the exact same directory as the original document.
   - **Specific Directory**: Click **Browse...** to choose an output folder. All converted files will be saved there.
4. **Convert**: Click **Convert Queue**. The files will be processed one by one. Check the console log at the bottom to see detailed logs.

---

## 2. Advanced LLM Features (OCR, Images, and Audio)

While standard documents (Word, Excel, PowerPoint, CSV, HTML) convert offline without any keys, files like images (JPG, PNG) or voice recordings (MP3, WAV) require a Vision or Audio LLM to perform transcription and visual descriptions.

### How to set up an LLM:
1. Expand the **Advanced LLM Settings** accordion at the top left.
2. Toggle the switch to **Enable LLM**.
3. Select your provider:
   - **Nvidia NIM**: Offers a free trial API key. Register on Nvidia Developer to get a key.
     - Default Model: `meta/llama-3.2-11b-vision-instruct`
   - **OpenAI**: Requires an OpenAI API Key.
     - Default Model: `gpt-4o`
   - **OpenRouter**: Highly popular LLM provider. Supports many models.
     - Default Model: `google/gemini-2.5-flash`
   - **Custom**: For local LLM APIs (like Ollama or LocalAI) or other OpenAI-compatible APIs.
     - Requires entering your Custom Base URL (e.g. `http://localhost:11434/v1` for Ollama).
4. Enter your **API Key** (stored securely on disk in `backend/config.json`, which is excluded from Git to prevent leaks).
5. Click **Convert Queue**. Files that require an LLM will now use the configured model to generate captions or transcripts.

---

## 3. Supported File Extensions & Conversion Engines

TD-markitdown wraps Microsoft's `markitdown` library. Under the hood, it uses the following modules:
- **PDF**: Extracts text and layouts using `pdfplumber`. If LLM is active, it can also send image representations of pages for visual layout rendering.
- **Word (.docx)**: Uses `python-docx` to extract text, lists, and tables.
- **Excel (.xlsx, .xls)**: Uses `openpyxl` to extract spreadsheets into Markdown tables.
- **PowerPoint (.pptx)**: Uses `python-pptx` to parse presentations slide-by-slide.
- **HTML**: Uses `beautifulsoup4` to extract structured page elements.
- **Images (.jpg, .jpeg, .png)**: Requires LLM. Analyzes images using Vision models to write text descriptions.
- **Audio (.mp3, .wav)**: Requires LLM. Transcribes recordings into text.
- **ZIP**: Unpacks and recursively converts all supported documents inside the archive.

---

## 4. Troubleshooting

### The terminal closes immediately or errors on launch
- Ensure **Python 3.10+** is installed on your computer.
- Open your Command Prompt and type `python --version` to verify it is active. If it says command not found, reinstall Python and check "Add Python to PATH".

### Native dialogues don't open
- Check the console logs.
- Make sure that another dialog isn't already open in the background (check your taskbar for a blinking Python window). Only one dialog can be open at a time.

### Conversion fails or errors
- For files requiring LLM (like PNG/JPG): make sure you enabled the LLM toggle, selected the correct provider, entered a valid API key, and have an internet connection.
- For files that are password protected (e.g. encrypted PDFs/Word docs): they cannot be converted. Decrypt them first.
