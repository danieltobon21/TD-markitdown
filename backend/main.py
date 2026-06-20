# =========================================================================
# TD-markitdown Backend
# Developed by dtmadman 2026™ under TobonDigital.com
# Git Repository: https://github.com/danieltobon21/TD-markitdown.git
# =========================================================================

import os
import tkinter as tk
from tkinter import filedialog
import threading
import webbrowser
import time
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from markitdown import MarkItDown
from openai import OpenAI

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
    with dialog_lock:
        root = tk.Tk()
        root.withdraw()
        root.attributes('-topmost', True)
        file_paths = filedialog.askopenfilenames(
            title="Select Files to Convert",
            filetypes=[
                ("All Supported Files", "*.pdf;*.docx;*.xlsx;*.pptx;*.html;*.csv;*.json;*.xml;*.png;*.jpg;*.jpeg;*.mp3;*.wav;*.zip"),
                ("PDF Documents", "*.pdf"),
                ("Word Documents", "*.docx"),
                ("Excel Sheets", "*.xlsx;*.xls"),
                ("PowerPoint Presentations", "*.pptx"),
                ("Web & Structured", "*.html;*.csv;*.json;*.xml"),
                ("Images", "*.png;*.jpg;*.jpeg"),
                ("Audio", "*.mp3;*.wav"),
                ("Archives", "*.zip"),
                ("All Files", "*.*")
            ]
        )
        paths = list(file_paths)
        root.destroy()
        return paths

def open_folder_dialog():
    with dialog_lock:
        root = tk.Tk()
        root.withdraw()
        root.attributes('-topmost', True)
        folder_path = filedialog.askdirectory(title="Select Output Folder")
        root.destroy()
        return folder_path

class ConvertRequest(BaseModel):
    filepath: str
    output_mode: str  # "same_dir" or "custom_dir"
    output_dir: Optional[str] = None
    llm_enabled: bool = False
    llm_provider: Optional[str] = None
    llm_api_key: Optional[str] = None
    llm_model: Optional[str] = None
    llm_base_url: Optional[str] = None

@app.get("/")
def read_root():
    # Serve index.html from frontend folder
    return FileResponse(os.path.join(os.path.dirname(__file__), "..", "frontend", "index.html"))

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
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/select-folder")
def select_folder():
    try:
        path = open_folder_dialog()
        return {"folder": path if path else None}
    except Exception as e:
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
    import subprocess
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    try:
        # Highlight file in explorer
        subprocess.run(['explorer', '/select,', os.path.normpath(path)])
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/convert-file")
def convert_file(req: ConvertRequest):
    if not os.path.exists(req.filepath):
        raise HTTPException(status_code=400, detail="Source file does not exist")
    
    # 1. Determine output file path
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
    
    # 2. Configure MarkItDown with optional LLM
    try:
        llm_client = None
        llm_model = None
        
        if req.llm_enabled and req.llm_api_key:
            api_key = req.llm_api_key
            model = req.llm_model or "gpt-4o"
            base_url = None
            
            if req.llm_provider == "nvidia":
                base_url = "https://integrate.api.nvidia.com/v1"
                # Set default nvidia vision model if not customized
                model = req.llm_model or "meta/llama-3.2-11b-vision-instruct"
            elif req.llm_provider == "custom" and req.llm_base_url:
                base_url = req.llm_base_url
            
            llm_client = OpenAI(api_key=api_key, base_url=base_url)
            llm_model = model
            
        # Initialize MarkItDown
        if llm_client:
            md = MarkItDown(llm_client=llm_client, llm_model=llm_model)
        else:
            md = MarkItDown()
            
        # Perform conversion
        result = md.convert(req.filepath)
        
        # Write output file
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

# Mount static frontend assets
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
app.mount("/frontend", StaticFiles(directory=frontend_dir), name="frontend")

def open_browser():
    # Wait a moment for uvicorn to bind to port
    time.sleep(1.5)
    webbrowser.open("http://127.0.0.1:8000")

if __name__ == "__main__":
    # Start browser-opening thread
    threading.Thread(target=open_browser, daemon=True).start()
    # Run uvicorn server
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
