# TD-markitdown 🚀 (por TobonDigital)

**TD-markitdown** (donde TD significa **TobonDigital**) es una aplicación web de escritorio premium, visual y altamente intuitiva diseñada para convertir varios formatos de documentos (PDF, Word, Excel, PowerPoint, HTML, ZIP, imágenes, audio, etc.) en archivos Markdown (`.md`) limpios y estructurados.

Desarrollado por **dtmadman** para [TobonDigital.com](https://tobondigital.com).

Repositorio Oficial: [https://github.com/danieltobon21/TD-markitdown.git](https://github.com/danieltobon21/TD-markitdown.git)

Esta aplicación funciona gracias a la excelente biblioteca de código abierto [Microsoft MarkItDown](https://github.com/microsoft/markitdown). Expresamos nuestro agradecimiento y otorgamos todo el crédito al equipo de Microsoft por desarrollar el motor de conversión principal.

---

## Características

- 🌟 **Interfaz de Usuario Premium**: Diseño moderno con glassmorphic panels, columnas adaptables, gradientes dinámicos y microanimaciones fluidas.
- 🗣️ **Soporte Bilingüe**: Completamente localizado tanto en **Inglés** (por defecto) como en **Español**. Cambia de idioma instantáneamente con un clic.
- 💻 **Diálogos Nativos de Windows**: Integra diálogos nativos del explorador de archivos para seleccionar documentos y carpetas de destino de forma fluida.
- 📁 **Modos de Salida Flexibles**: Guarda los archivos Markdown generados junto al archivo de origen o centralízalos en una carpeta dedicada.
- 🤖 **Integraciones Avanzadas de LLM**: Configura claves de API gratuitas de Nvidia NIM, OpenAI o endpoints personalizados para procesar elementos complejos (como transcribir audios, realizar OCR en PDFs y describir imágenes mediante modelos de visión).
- 📜 **Consola de Registro en Tiempo Real**: Sigue la conversión y los errores en tiempo real a través de un panel de log interactivo.

---

## Formatos Soportados

- **Documentos**: PDF (`.pdf`), Word (`.docx`), Excel (`.xlsx`, `.xls`), PowerPoint (`.pptx`)
- **Datos Estructurados y Web**: HTML (`.html`), CSV (`.csv`), JSON (`.json`), XML (`.xml`)
- **Multimedia (Requiere LLM)**: Imágenes (`.png`, `.jpg`, `.jpeg`), Audio (`.mp3`, `.wav`)
- **Archivos Comprimidos**: Archivos ZIP (`.zip`, procesados de manera recursiva)

---

## Instalación y Uso (Windows)

TD-markitdown incluye un proceso autoejecutable que instala las dependencias de Python dentro de un entorno virtual local (`.venv`) para mantener limpio tu sistema.

### Requisitos Previos
- Tener instalado [Python 3.10 o superior](https://www.python.org/downloads/). Asegúrate de marcar la casilla **"Add Python to PATH"** durante la instalación.

### Ejecución de la Aplicación
1. Clona o descarga este repositorio en tu equipo.
2. Haz doble clic en el lanzador compilado **`TD-markitdown.exe`** en la carpeta raíz.
3. La aplicación se iniciará de forma silenciosa (sin mostrar la ventana negra de la terminal) y abrirá una ventana de aplicación de escritorio nativa.
4. *Alternativa*: También puedes ejecutar la aplicación haciendo doble clic en `run.bat` (o ejecutando `.\run.bat` en una terminal).

### Comprobar y Actualizar MarkItDown
En la parte inferior de la ventana de escritorio, verás un pie de página de estado del sistema que muestra la versión activa de Python y la versión actual de la biblioteca principal `markitdown`.
* Cada vez que Microsoft publique nuevas versiones o modificaciones, haz clic en el botón **"Actualizar Núcleo"** en el pie de página.
* La aplicación ejecutará `pip install --upgrade markitdown[all]` de forma asíncrona, transmitirá el log de instalación en tiempo real a la consola y actualizará el número de versión una vez completado.

### Compilar el Ejecutable Lanzador
Si en algún momento deseas volver a compilar el binario del lanzador `TD-markitdown.exe` por ti mismo:
1. Abre PowerShell en el directorio del proyecto.
2. Activa el entorno virtual e instala pyinstaller:
   ```powershell
   .\.venv\Scripts\pip.exe install pyinstaller
   ```
3. Ejecuta el comando de compilación:
   ```powershell
   .\.venv\Scripts\pyinstaller.exe --onefile --noconsole --icon=frontend/logo_t.png --name=TD-markitdown launcher.py
   ```
4. El nuevo ejecutable estará disponible dentro de la carpeta `dist/`. Muévelo a la carpeta raíz del proyecto.

---

## Créditos
Esta interfaz gráfica es una envoltura (wrapper) construida sobre [Microsoft MarkItDown](https://github.com/microsoft/markitdown). Todos los procesos principales de análisis, conversión y traducción de archivos son manejados por sus bibliotecas. Visita su repositorio para apoyar su proyecto y leer su documentación detallada.

---

## Documentación
- English User Manual: [docs/user_manual.md](docs/user_manual.md)
- Manual de Usuario en Español: [docs/manual_usuario.md](docs/manual_usuario.md)
