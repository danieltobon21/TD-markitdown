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
        
    bat_path = os.path.join(base_dir, "run.bat")
    
    if not os.path.exists(bat_path):
        import tkinter as tk
        from tkinter import messagebox
        root = tk.Tk()
        root.withdraw()
        messagebox.showerror(
            "Launcher Error", 
            f"Could not find 'run.bat' in '{base_dir}'.\n\nPlease ensure run.bat exists in the application root folder."
        )
        sys.exit(1)
        
    # Start run.bat silently (no console window, detached process)
    try:
        # CREATE_NO_WINDOW = 0x08000000
        # DETACHED_PROCESS = 0x00000008
        flags = 0x08000000 | 0x00000008
        subprocess.Popen([bat_path], creationflags=flags, cwd=base_dir)
    except Exception as e:
        import tkinter as tk
        from tkinter import messagebox
        root = tk.Tk()
        root.withdraw()
        messagebox.showerror("Launcher Error", f"Failed to start launcher process: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
