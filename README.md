# TD-markitdown 🚀 (by TobonDigital)

**TD-markitdown** (where TD stands for **TobonDigital**) is a premium, visual, and highly intuitive desktop-web application built to convert various document formats (PDF, Word, Excel, PowerPoint, HTML, ZIP, images, audio, etc.) into clean, structured Markdown (`.md`) files.

Developed by **dtmadman** for [TobonDigital.com](https://tobondigital.com).

Official Repository: [https://github.com/danieltobon21/TD-markitdown.git](https://github.com/danieltobon21/TD-markitdown.git)

This application is powered by the excellent open-source library [Microsoft MarkItDown](https://github.com/microsoft/markitdown). We would like to express our gratitude and give full credit to the Microsoft team for developing the core conversion engine.

---

## Features

- 🌟 **Premium User Interface**: Modern design with glassmorphism, responsive columns, dynamic gradients, and fluid micro-animations.
- 🗣️ **Bilingual Support**: Fully localized in both **English** (default) and **Spanish**. Switch languages instantly with a click.
- 💻 **Native Windows Dialogues**: Integrates native file and folder dialogues for seamless selection of files and custom save paths.
- 📁 **Flexible Output Modes**: Save output Markdown files directly next to their source files or consolidate them in a dedicated folder.
- 🤖 **Advanced LLM Integrations**: Configure free Nvidia NIM APIs, OpenAI, or custom endpoints to process complex elements (such as transcribing audio, OCR on PDFs, and generating descriptions for images via Vision LLM models).
- 📜 **Real-time Console Log**: Track conversion events and errors in real-time through an interactive logging view.

---

## Supported Formats

- **Documents**: PDF (`.pdf`), Word (`.docx`), Excel (`.xlsx`, `.xls`), PowerPoint (`.pptx`)
- **Web & Structured Data**: HTML (`.html`), CSV (`.csv`), JSON (`.json`), XML (`.xml`)
- **Media (Requires LLM)**: Images (`.png`, `.jpg`, `.jpeg`), Audio (`.mp3`, `.wav`)
- **Archives**: ZIP files (`.zip`, processed recursively)

---

## Installation & Usage (Windows)

TD-markitdown includes a self-bootstrapping process that sets up all dependencies within a local, sandboxed virtual environment (`.venv`).

### Prerequisites
- [Python 3.10 or higher](https://www.python.org/downloads/) installed. Ensure you check **"Add Python to PATH"** during installation.

### Running the App
1. Clone or download this repository to your machine.
2. Double-click the compiled **`TD-markitdown.exe`** launcher in the root folder.
3. The application will start silently (no command prompt window shown) and launch a native desktop application window.
4. *Alternative*: You can also run the app by running `run.bat` (or typing `.\run.bat` in a terminal).

### Checking & Updating MarkItDown
At the bottom of the desktop application window, you will see a system status footer displaying the active Python version and the currently installed version of the core `markitdown` library.
* Whenever Microsoft publishes updates or modifications, click the **"Update Core"** button in the footer.
* The application will run `pip install --upgrade markitdown[all]` asynchronously, stream the installation log in real-time to the console, and refresh the version once completed.

### Compiling the Launcher Executable
If you ever want to re-compile the launcher binary `TD-markitdown.exe` yourself:
1. Open PowerShell in the project directory.
2. Activate the virtual environment and install pyinstaller:
   ```powershell
   .\.venv\Scripts\pip.exe install pyinstaller
   ```
3. Run the compilation command:
   ```powershell
   .\.venv\Scripts\pyinstaller.exe --onefile --noconsole --icon=frontend/logo_t.png --name=TD-markitdown launcher.py
   ```
4. The new executable will be available inside the `dist/` directory. Move it to the root folder of the project.

---

## Credit
This wrapper is a custom interface built on top of [Microsoft MarkItDown](https://github.com/microsoft/markitdown). All core file parsing, conversion, and translation utilities are handled by their libraries. Please visit their repository to star their project and read their detailed documentation.

---

## Documentation
- English User Manual: [docs/user_manual.md](docs/user_manual.md)
- Manual de Usuario en Español: [docs/manual_usuario.md](docs/manual_usuario.md)
