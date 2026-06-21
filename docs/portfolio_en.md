---
title: "TD-markitdown: Document to Markdown Converter UI"
description: "A premium, visual, and highly intuitive desktop-web wrapper for Microsoft MarkItDown, featuring modern glassmorphism UI, native Windows dialogs, bilingual support, and advanced LLM integrations."
date: "2026-06-20"
category: "Software Development"
tags: ["Python", "FastAPI", "Uvicorn", "Microsoft MarkItDown", "HTML5", "CSS3", "JavaScript"]
github_url: "https://github.com/danieltobon21/TD-markitdown.git"
project_url: "https://github.com/danieltobon21/TD-markitdown.git"
image: "/images/portfolio/td-markitdown.png"
---

# TD-markitdown 🚀

**TD-markitdown** (developed for **TobonDigital.com**) is a premium, visual, and highly intuitive desktop-web application built to convert various document formats into clean, structured Markdown (`.md`) files. 

Powered by **Microsoft MarkItDown**, this application wraps the robust core conversion library in a modern, single-page visual utility.

---

## The Challenge
Converting legacy or proprietary document formats (like PDF, Word, Excel, PowerPoint) into clean Markdown for LLMs, documentation, or static sites often requires running command-line tools or uploading sensitive documents to online third-party tools. 

We wanted to create a **100% local, visually stunning, and easy-to-use desktop tool** that simplifies this workflow for developers and non-technical users alike, without compromising security.

---

## Key Features

* 🌟 **Premium User Interface**: Engineered with modern design aesthetics, featuring glassmorphism, responsive columns, dynamic background gradients, and fluid micro-animations.
* 🗣️ **Bilingual Support**: Fully localized in both **English** and **Spanish** with instant runtime language switching.
* 💻 **Native Windows Dialogues**: Bypasses browser file upload restrictions by invoking native Windows file and folder selectors safely via background PowerShell processes.
* 📁 **Flexible Output Modes**: Save output Markdown files next to their source files or consolidate them in a dedicated folder.
* 🤖 **Advanced LLM Integrations**: Configure free Nvidia NIM APIs, OpenAI, OpenRouter, or custom endpoints to process complex elements (such as transcribing audio, OCR on PDFs, and generating descriptions for images via Vision LLM models).
* 📜 **Real-time Console Log**: Track conversion events and pip installations in real-time through an interactive, copyable logging view.

---

## Technical Architecture

* **Backend**: **Python 3.10+** & **FastAPI** serving as a local web server, utilizing **Uvicorn** for fast asynchronous routing.
* **Frontend**: Responsive single-page application built using **HTML5**, modern **Vanilla CSS** (employing custom properties, HSL color modeling, and keyframe animations), and asynchronous **JavaScript**.
* **Self-Bootstrapping**: Packaged with a self-installing PowerShell script (`run.ps1`/`run.bat`) that automatically creates a local virtual environment (`.venv`), upgrades pip, installs dependencies, and opens the default web browser.

---

## Supported Formats

* **Documents**: PDF (`.pdf`), Word (`.docx`), Excel (`.xlsx`, `.xls`), PowerPoint (`.pptx`)
* **Web & Structured Data**: HTML (`.html`), CSV (`.csv`), JSON (`.json`), XML (`.xml`)
* **Media (Requires LLM)**: Images (`.png`, `.jpg`, `.jpeg`), Audio (`.mp3`, `.wav`)
* **Archives**: ZIP files (`.zip`, processed recursively)
