"""Optional Tkinter GUI for the PAF builder."""
import tkinter as tk
from tkinter import filedialog, messagebox
from pathlib import Path


def launch():
    root = tk.Tk()
    root.title("PAF Builder")
    tk.Label(root, text="App payload:").grid(row=0, column=0)
    entry = tk.Entry(root, width=50)
    entry.grid(row=0, column=1)
    tk.Button(root, text="Browse", command=lambda: entry.insert(0, filedialog.askdirectory())).grid(row=0, column=2)
    tk.Label(root, text="Name:").grid(row=1, column=0)
    name = tk.Entry(root); name.grid(row=1, column=1)
    tk.Label(root, text="Version:").grid(row=2, column=0)
    ver = tk.Entry(root); ver.insert(0, "1.0.0"); ver.grid(row=2, column=1)

    def build():
        from .core.build_engine import build_skeleton, copy_app_payload
        from .core.validator import validate
        from .core.launcher_generator import generate_launchers
        bd = Path("builds") / f"{name.get()}_{ver.get()}"
        build_skeleton(bd, name.get(), ver.get())
        if entry.get():
            copy_app_payload(bd, Path(entry.get()))
        generate_launchers(bd, name.get())
        errs = validate(bd)
        messagebox.showinfo("Done", f"Built {bd}" + (f"\nWarnings: {errs}" if errs else ""))

    tk.Button(root, text="Build", command=build).grid(row=3, column=1)
    root.mainloop()


if __name__ == "__main__":
    launch()
