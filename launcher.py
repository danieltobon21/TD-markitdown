# =========================================================================
# TD-markitdown Silent Launcher
# Developed by dtmadman 2026™ under TobonDigital.com
# =========================================================================

import subprocess
import os
import sys

def main():
    # Find launcher directory (works if run as script or frozen exe)
    if getattr(sys, 'frozen', False):
        base_dir = os.path.dirname(os.path.abspath(sys.executable))
    else:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        
    python_exe = os.path.join(base_dir, ".venv", "Scripts", "python.exe")
    main_py = os.path.join(base_dir, "backend", "main.py")
    
    if not os.path.exists(python_exe) or not os.path.exists(main_py):
        import tkinter as tk
        from tkinter import messagebox
        root = tk.Tk()
        root.withdraw()
        messagebox.showerror(
            "Launcher Error", 
            f"Could not find virtual environment or backend files in '{base_dir}'.\n\nPlease run 'run.bat' once to initialize the environment."
        )
        sys.exit(1)
        
    # Start python backend process directly and silently (no console window)
    try:
        # CREATE_NO_WINDOW = 0x08000000
        # DETACHED_PROCESS = 0x00000008
        flags = 0x08000000 | 0x00000008
        subprocess.Popen([python_exe, main_py], creationflags=flags, cwd=base_dir)
    except Exception as e:
        import tkinter as tk
        from tkinter import messagebox
        root = tk.Tk()
        root.withdraw()
        messagebox.showerror("Launcher Error", f"Failed to start backend process: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
