# =========================================================================
# TD-markitdown Backend
# Developed by dtmadman 2026™ under TobonDigital.com
# Git Repository: https://github.com/danieltobon21/TD-markitdown.git
# =========================================================================

import os
import sys

# Determine the application base directory depending on whether running frozen or as script
if getattr(sys, 'frozen', False):
    base_dir = os.path.dirname(sys.executable)
else:
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# If running as a frozen PyInstaller executable, dynamically prioritize
# the local virtual environment's site-packages to allow dynamic core upgrades.
if getattr(sys, 'frozen', False):
    venv_site_packages = os.path.join(base_dir, ".venv", "Lib", "site-packages")
    if os.path.exists(venv_site_packages):
        sys.path.insert(0, venv_site_packages)

import subprocess
import threading
import time
import socket
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn


app = FastAPI(title="TD-markitdown Backend")

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Threading lock for native dialogs to prevent multiple dialogs opening at once
dialog_lock = threading.Lock()


def open_file_dialog():
    """
    Open a native Windows file selection dialog using PowerShell.
    Works safely from any thread (no tkinter STA/COM restrictions).
    """
    with dialog_lock:
        script = (
            "Add-Type -AssemblyName System.Windows.Forms; "
            "$d = New-Object System.Windows.Forms.OpenFileDialog; "
            "$d.Multiselect = $true; "
            "$d.Title = 'Select Files to Convert'; "
            "$d.Filter = 'All Supported Files|*.pdf;*.docx;*.xlsx;*.xls;*.pptx;*.html;*.csv;*.json;*.xml;*.png;*.jpg;*.jpeg;*.mp3;*.wav;*.zip|"
            "PDF Documents|*.pdf|"
            "Word Documents|*.docx|"
            "Excel Sheets|*.xlsx;*.xls|"
            "PowerPoint|*.pptx|"
            "Web and Structured|*.html;*.csv;*.json;*.xml|"
            "Images|*.png;*.jpg;*.jpeg|"
            "Audio|*.mp3;*.wav|"
            "Archives|*.zip|"
            "All Files|*.*'; "
            "if ($d.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { $d.FileNames -join '|' }"
        )
        try:
            result = subprocess.run(
                ["powershell", "-NoProfile", "-NonInteractive", "-Command", script],
                capture_output=True,
                text=True,
                timeout=300,
                creationflags=0x08000000  # CREATE_NO_WINDOW
            )
            if result.returncode == 0 and result.stdout.strip():
                paths = [p.strip() for p in result.stdout.strip().split("|") if p.strip()]
                return paths
        except Exception as e:
            print(f"[Warning] File dialog error: {e}")
    return []


def open_folder_dialog():
    """
    Open a native Windows folder selection dialog using PowerShell.
    Works safely from any thread.
    """
    with dialog_lock:
        script = (
            "Add-Type -AssemblyName System.Windows.Forms; "
            "$d = New-Object System.Windows.Forms.FolderBrowserDialog; "
            "$d.Description = 'Select Output Folder'; "
            "$d.ShowNewFolderButton = $true; "
            "if ($d.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { $d.SelectedPath }"
        )
        try:
            result = subprocess.run(
                ["powershell", "-NoProfile", "-NonInteractive", "-Command", script],
                capture_output=True,
                text=True,
                timeout=300,
                creationflags=0x08000000  # CREATE_NO_WINDOW
            )
            if result.returncode == 0 and result.stdout.strip():
                return result.stdout.strip()
        except Exception as e:
            print(f"[Warning] Folder dialog error: {e}")
    return None


class ConvertRequest(BaseModel):
    filepath: str
    output_mode: str  # "same_dir" or "custom_dir"
    output_dir: Optional[str] = None
    llm_enabled: bool = False
    llm_provider: Optional[str] = None
    llm_api_key: Optional[str] = None
    llm_model: Optional[str] = None
    llm_base_url: Optional[str] = None


class MetadataRequest(BaseModel):
    paths: List[str]


@app.post("/api/file-metadata")
def get_file_metadata(req: MetadataRequest):
    files_metadata = []
    for path in req.paths:
        if os.path.exists(path):
            stat = os.stat(path)
            files_metadata.append({
                "path": path,
                "name": os.path.basename(path),
                "size": stat.st_size,
                "type": os.path.splitext(path)[1].lower()
            })
    return {"files": files_metadata}


@app.get("/")
def read_root():
    return FileResponse(os.path.join(base_dir, "frontend", "index.html"))


@app.get("/api/select-files")
def select_files():
    try:
        paths = open_file_dialog()
        files_metadata = []
        for path in paths:
            if os.path.exists(path):
                stat = os.stat(path)
                files_metadata.append({
                    "path": path,
                    "name": os.path.basename(path),
                    "size": stat.st_size,
                    "type": os.path.splitext(path)[1].lower()
                })
        return {"files": files_metadata}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/select-folder")
def select_folder():
    try:
        path = open_folder_dialog()
        return {"folder": path if path else None}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/open-file")
def open_file(path: str):
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    try:
        os.startfile(path)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/open-folder")
def open_folder(path: str):
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    try:
        subprocess.run(['explorer', '/select,', os.path.normpath(path)])
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/convert-file")
def convert_file(req: ConvertRequest):
    if not os.path.exists(req.filepath):
        raise HTTPException(status_code=400, detail="Source file does not exist")

    filename = os.path.basename(req.filepath)
    name, _ = os.path.splitext(filename)
    output_filename = f"{name}.md"

    if req.output_mode == "same_dir":
        output_dir = os.path.dirname(req.filepath)
    elif req.output_mode == "custom_dir":
        if not req.output_dir:
            raise HTTPException(status_code=400, detail="Output directory not specified")
        output_dir = req.output_dir
        if not os.path.exists(output_dir):
            try:
                os.makedirs(output_dir, exist_ok=True)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Cannot create output directory: {str(e)}")
    else:
        raise HTTPException(status_code=400, detail="Invalid output mode")

    output_filepath = os.path.join(output_dir, output_filename)

    try:
        from markitdown import MarkItDown
        from openai import OpenAI

        llm_client = None
        llm_model = None

        if req.llm_enabled and req.llm_api_key:
            api_key = req.llm_api_key
            model = req.llm_model or "gpt-4o"
            base_url = None
            default_headers = None

            if req.llm_provider == "nvidia":
                base_url = "https://integrate.api.nvidia.com/v1"
                model = req.llm_model or "meta/llama-3.2-11b-vision-instruct"
            elif req.llm_provider == "openrouter":
                base_url = "https://openrouter.ai/api/v1"
                model = req.llm_model or "google/gemini-2.5-flash"
                default_headers = {
                    "HTTP-Referer": "https://tobondigital.com",
                    "X-Title": "TD-markitdown"
                }
            elif req.llm_provider == "custom" and req.llm_base_url:
                base_url = req.llm_base_url

            llm_client = OpenAI(api_key=api_key, base_url=base_url, default_headers=default_headers)
            llm_model = model

        md = MarkItDown(llm_client=llm_client, llm_model=llm_model) if llm_client else MarkItDown()
        result = md.convert(req.filepath)

        with open(output_filepath, "w", encoding="utf-8") as f:
            f.write(result.text_content)

        return {
            "success": True,
            "output_path": output_filepath,
            "filename": output_filename
        }
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(error_details)
        raise HTTPException(status_code=500, detail=str(e))


import json

CONFIG_PATH = os.path.join(base_dir, "backend", "config.json")


def load_config():
    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_config(config_data):
    try:
        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(config_data, f, indent=4, ensure_ascii=False)
        return True
    except Exception:
        return False


class SettingsModel(BaseModel):
    llm_enabled: bool
    llm_provider: str
    llm_api_key: str
    llm_model: str
    llm_base_url: str
    output_mode: str
    output_dir: str


class TestLLMRequest(BaseModel):
    llm_provider: str
    llm_api_key: str
    llm_model: str
    llm_base_url: Optional[str] = None


@app.get("/api/settings")
def get_settings():
    return load_config()


@app.post("/api/settings")
def save_settings_endpoint(settings: SettingsModel):
    success = save_config(settings.dict())
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save settings")
    return {"success": True}


@app.post("/api/test-llm")
def test_llm_connection(req: TestLLMRequest):
    if not req.llm_api_key:
        raise HTTPException(status_code=400, detail="API Key is required")
    api_key = req.llm_api_key
    model = req.llm_model or "gpt-4o"
    base_url = None
    default_headers = None
    if req.llm_provider == "nvidia":
        base_url = "https://integrate.api.nvidia.com/v1"
        model = req.llm_model or "meta/llama-3.2-11b-vision-instruct"
    elif req.llm_provider == "openrouter":
        base_url = "https://openrouter.ai/api/v1"
        model = req.llm_model or "google/gemini-2.5-flash"
        default_headers = {
            "HTTP-Referer": "https://tobondigital.com",
            "X-Title": "TD-markitdown"
        }
    elif req.llm_provider == "custom" and req.llm_base_url:
        base_url = req.llm_base_url
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key, base_url=base_url, default_headers=default_headers, timeout=10.0)
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": "Respond with one word: Connection successful"}],
            max_tokens=5
        )
        reply = response.choices[0].message.content.strip()
        return {
            "success": True,
            "message": f"Connection verified! Response: \"{reply}\""
        }
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/system-info")
def get_system_info():
    import importlib.metadata
    try:
        md_version = importlib.metadata.version("markitdown")
    except Exception:
        md_version = "Unknown"
    python_version = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    return {
        "markitdown_version": md_version,
        "python_version": python_version
    }


@app.post("/api/update-core")
def update_core():
    def generate():
        cmd = [sys.executable, "-m", "pip", "install", "--upgrade", "markitdown[all]", "--upgrade-strategy", "only-if-needed"]
        yield "[System] Starting update process...\n"
        yield f"[System] Running command: {' '.join(cmd)}\n\n"
        try:
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            for line in process.stdout:
                yield line
            process.wait()
            if process.returncode == 0:
                yield "\n[System] Update completed successfully!\n"
            else:
                yield f"\n[System] Update failed with exit code {process.returncode}\n"
        except Exception as e:
            yield f"\n[System] Error during update: {str(e)}\n"
    return StreamingResponse(generate(), media_type="text/plain")


# Mount static frontend assets
frontend_dir = os.path.abspath(os.path.join(base_dir, "frontend"))
app.mount("/frontend", StaticFiles(directory=frontend_dir), name="frontend")


def is_port_open(host, port, timeout=0.1):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(timeout)
            s.connect((host, port))
            return True
    except Exception:
        return False


def start_server():
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False, log_level="error")


def find_edge():
    """Locate Microsoft Edge executable on Windows."""
    candidates = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe"),
    ]
    for path in candidates:
        if os.path.exists(path):
            return path
    return None


if __name__ == "__main__":
    if "--no-gui" in sys.argv:
        # Headless server mode (for development / run.bat)
        uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)
    else:
        # --- GUI Mode: Edge App Window ---

        # Check if server is already running on port 8000 (handles double-launch)
        server_already_running = is_port_open("127.0.0.1", 8000)

        if not server_already_running:
            # Start FastAPI in background daemon thread (exits when main thread exits)
            server_thread = threading.Thread(target=start_server, daemon=True)
            server_thread.start()

            # Wait for server to be ready (max ~5 seconds)
            for _ in range(50):
                if is_port_open("127.0.0.1", 8000):
                    break
                time.sleep(0.1)

        # Launch Microsoft Edge in App Mode (app window, no browser chrome)
        edge_path = find_edge()

        if edge_path:
            proc = subprocess.Popen(
                [
                    edge_path,
                    "--app=http://127.0.0.1:8000",
                    "--no-first-run",
                    "--no-default-browser-check",
                    "--disable-extensions",
                    "--new-window",
                ],
                creationflags=0x08000000  # CREATE_NO_WINDOW for the Edge launcher process
            )
            proc.wait()  # Block main thread until Edge app window is closed
        else:
            # Fallback: default system browser
            import webbrowser
            webbrowser.open("http://127.0.0.1:8000")
            # Keep server alive until user terminates
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                pass

        sys.exit(0)
