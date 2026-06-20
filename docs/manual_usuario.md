# Manual de Usuario de TD-markitdown 📖

¡Bienvenido a TD-markitdown! Esta guía te ayudará a configurar y utilizar la aplicación para convertir tus archivos en documentos Markdown (.md) estructurados.

---

## 1. Inicio Rápido

1. **Iniciar la aplicación**: Haz doble clic en el archivo `run.bat`. La aplicación instalará las dependencias que falten e iniciará automáticamente el servidor en tu navegador web predeterminado en `http://127.0.0.1:8000`.
2. **Agregar archivos**:
   - Haz clic en el botón **Elegir Archivos** para abrir el explorador de archivos nativo de Windows.
   - Selecciona uno o más archivos (puedes seleccionar archivos de diferentes formatos al mismo tiempo).
   - Aparecerán en la **Cola de Conversión**.
3. **Elegir la ubicación de salida**:
   - **Misma Carpeta**: Genera el archivo `.md` en el mismo directorio donde se encuentra el documento original.
   - **Directorio Específico**: Haz clic en **Buscar...** (Browse...) para elegir una carpeta de salida. Todos los archivos convertidos se guardarán allí.
4. **Convertir**: Haz clic en **Convertir Cola**. Los archivos se procesarán secuencialmente. Puedes ver el detalle del progreso en la Consola de Registro en la parte inferior.

---

## 2. Funciones Avanzadas de LLM (OCR, Imágenes y Audio)

Mientras que los documentos estándar (Word, Excel, PowerPoint, CSV, HTML) se convierten localmente y sin conexión sin necesidad de configurar claves de API, los archivos multimedia como imágenes (JPG, PNG) o grabaciones de audio (MP3, WAV) requieren de un Modelo de Lenguaje Visual o de Audio (LLM) para realizar transcripciones y descripciones.

### Cómo configurar un LLM:
1. Despliega el panel de **Configuración Avanzada de LLM** en la parte superior izquierda.
2. Activa la casilla **Habilitar LLM**.
3. Selecciona tu proveedor:
   - **Nvidia NIM**: Ofrece claves de API de prueba gratuitas. Regístrate en Nvidia Developer para obtener una.
     - Modelo por defecto: `meta/llama-3.2-11b-vision-instruct`
   - **OpenAI**: Requiere una clave de API de OpenAI.
     - Modelo por defecto: `gpt-4o`
   - **Personalizado**: Para APIs locales (como Ollama o LocalAI) u otros proveedores compatibles con el SDK de OpenAI.
     - Requiere ingresar la URL Base (ej. `http://localhost:11434/v1` para Ollama).
4. Introduce tu **Clave de API (API Key)**. (Se mantiene segura en la memoria de la sesión del navegador, mientras que las otras configuraciones se guardan en el almacenamiento local).
5. Haz clic en **Convertir Cola**. Los archivos que requieran procesamiento avanzado utilizarán el modelo seleccionado para generar las descripciones o transcripciones.

---

## 3. Extensiones Soportadas y Motores de Conversión

TD-markitdown utiliza la biblioteca `markitdown` de Microsoft. Por debajo, aprovecha los siguientes módulos:
- **PDF**: Extrae texto y tablas mediante `pdfplumber`. Si el LLM está activo, puede enviar capturas de las páginas para una mejor renderización del diseño visual.
- **Word (.docx)**: Utiliza `python-docx` para extraer texto, listas y tablas.
- **Excel (.xlsx, .xls)**: Utiliza `openpyxl` para convertir hojas de cálculo en tablas Markdown.
- **PowerPoint (.pptx)**: Utiliza `python-pptx` para analizar presentaciones diapositiva por diapositiva.
- **HTML**: Utiliza `beautifulsoup4` para extraer elementos estructurados de páginas web.
- **Imágenes (.jpg, .jpeg, .png)**: Requiere LLM. Analiza la imagen usando modelos de visión para describir lo que aparece en ella.
- **Audio (.mp3, .wav)**: Requiere LLM. Transcribe grabaciones de voz a texto Markdown.
- **ZIP**: Descomprime y convierte de forma recursiva todos los archivos soportados en su interior.

---

## 4. Solución de Problemas

### La terminal se cierra inmediatamente o muestra errores al abrir
- Asegúrate de tener instalado **Python 3.10 o superior** en tu equipo.
- Abre la consola de comandos de Windows (cmd) y escribe `python --version` para verificar que esté activo. Si no se reconoce el comando, vuelve a instalar Python y asegúrate de marcar la casilla "Add Python to PATH".

### Los diálogos nativos del sistema no se abren
- Verifica los registros en la Consola.
- Asegúrate de que no haya otra ventana de diálogo abierta en segundo plano (revisa en tu barra de tareas si hay alguna ventana de Python parpadeando). Solo se puede tener abierto un diálogo de archivo a la vez.

### La conversión falla o da error
- Para archivos que requieren LLM (como imágenes): asegúrate de haber activado la opción de LLM, seleccionado el proveedor correcto, ingresado una clave de API válida y contar con conexión a internet.
- Los archivos protegidos con contraseña (como PDFs o documentos Word encriptados) no se pueden convertir. Desmárcalos o desencriptados antes de procesarlos.
