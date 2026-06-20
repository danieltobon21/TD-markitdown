/* -------------------------------------------------------------
 * TD-markitdown Frontend Controller
 * Multi-language support, state management, and API calls.
 * ------------------------------------------------------------- */

// Translation Database
const translations = {
    en: {
        subtitle: "Convert your documents to clean Markdown with Microsoft MarkItDown",
        langLabel: "Español",
        llmTitle: "Advanced LLM Settings (OCR & Images)",
        enableLlm: "Enable LLM (Image Description & Advanced PDF)",
        llmProvider: "LLM Provider",
        apiKeyLabel: "API Key",
        modelNameLabel: "Model Name",
        customUrlLabel: "Custom Base URL",
        outputTitle: "Output Location Settings",
        outSame: "Save in the same folder as the source files",
        outCustom: "Save in a specific output directory",
        browse: "Browse...",
        dropTitle: "Drag & Drop Files Here",
        dropSubtitle: "Supports PDF, DOCX, XLSX, PPTX, Images, Audio, ZIP and more",
        chooseFiles: "Choose Files",
        queueTitle: "Conversion Queue",
        clearAll: "Clear All",
        emptyMsg: "No files selected. Add documents to start converting.",
        colName: "File Name",
        colSize: "Size",
        colStatus: "Status",
        progressLabel: "Overall Progress",
        convertBtn: "Convert Queue",
        consoleTitle: "Execution Console Log",
        statusPending: "Pending",
        statusConverting: "Converting",
        statusSuccess: "Success",
        statusError: "Error",
        logInit: "[System] TD-markitdown console initialized. Waiting for files.",
        logSelectFiles: "[System] Selected {count} file(s).",
        logSelectFolder: "[System] Selected output directory: {path}",
        logSelectFolderCancel: "[System] Folder selection cancelled.",
        logConvertStart: "[System] Starting conversion of {count} file(s)...",
        logConvertingFile: "[Info] Converting: {name}",
        logConvertedSuccess: "[Success] Converted: {name} -> saved to {path}",
        logConvertedError: "[Error] Failed converting {name}: {error}",
        logConvertFinish: "[System] Conversion process finished! Successful: {success}/{total}.",
        logQueueCleared: "[System] Queue cleared.",
        logConsoleCleared: "[System] Console log cleared.",
        logNoFiles: "[Warning] No files in the queue to convert.",
        logDragOver: "[System] Dragging files over dropzone...",
        logDropped: "[System] Dropped {count} file(s)."
    },
    es: {
        subtitle: "Convierte tus documentos a Markdown limpio usando Microsoft MarkItDown",
        langLabel: "English",
        llmTitle: "Configuración Avanzada de LLM (OCR e Imágenes)",
        enableLlm: "Habilitar LLM (Descripción de Imágenes y PDF Avanzado)",
        llmProvider: "Proveedor de LLM",
        apiKeyLabel: "Clave de API (API Key)",
        modelNameLabel: "Nombre del Modelo",
        customUrlLabel: "URL Base Personalizada",
        outputTitle: "Configuración del Directorio de Salida",
        outSame: "Guardar en la misma carpeta que los archivos de origen",
        outCustom: "Guardar en un directorio de salida específico",
        browse: "Buscar...",
        dropTitle: "Arrastra y Suelta Archivos Aquí",
        dropSubtitle: "Soporta PDF, DOCX, XLSX, PPTX, Imágenes, Audio, ZIP y más",
        chooseFiles: "Elegir Archivos",
        queueTitle: "Cola de Conversión",
        clearAll: "Limpiar Todo",
        emptyMsg: "No hay archivos seleccionados. Agrega documentos para comenzar.",
        colName: "Nombre del Archivo",
        colSize: "Tamaño",
        colStatus: "Estado",
        progressLabel: "Progreso General",
        convertBtn: "Convertir Cola",
        consoleTitle: "Consola de Registro de Ejecución",
        statusPending: "Pendiente",
        statusConverting: "Convirtiendo",
        statusSuccess: "Completado",
        statusError: "Error",
        logInit: "[Sistema] Consola TD-markitdown inicializada. Esperando archivos.",
        logSelectFiles: "[Sistema] Se seleccionaron {count} archivo(s).",
        logSelectFolder: "[Sistema] Directorio de salida seleccionado: {path}",
        logSelectFolderCancel: "[Sistema] Selección de directorio cancelada.",
        logConvertStart: "[Sistema] Iniciando conversión de {count} archivo(s)...",
        logConvertingFile: "[Info] Convirtiendo: {name}",
        logConvertedSuccess: "[Éxito] Convertido: {name} -> guardado en {path}",
        logConvertedError: "[Error] Falló la conversión de {name}: {error}",
        logConvertFinish: "[Sistema] Proceso de conversión finalizado. Exitosos: {success}/{total}.",
        logQueueCleared: "[Sistema] Cola de archivos limpia.",
        logConsoleCleared: "[Sistema] Consola de registros limpia.",
        logNoFiles: "[Advertencia] No hay archivos en la cola para convertir.",
        logDragOver: "[Sistema] Arrastrando archivos sobre la zona de descarga...",
        logDropped: "[Sistema] Se soltaron {count} archivo(s)."
    }
};

// Global App State
let state = {
    lang: 'en',
    files: [],
    customOutputDir: '',
    isConverting: false
};

// DOM Elements
const elements = {
    btnLanguage: document.getElementById('btn-language'),
    txtLangLabel: document.getElementById('txt-lang-label'),
    txtSubtitle: document.getElementById('txt-subtitle'),
    btnLlmAccordion: document.getElementById('btn-llm-accordion'),
    llmSettingsContent: document.getElementById('llm-settings-content'),
    chkLlmEnabled: document.getElementById('chk-llm-enabled'),
    llmFields: document.getElementById('llm-fields'),
    selLlmProvider: document.getElementById('sel-llm-provider'),
    txtApiKey: document.getElementById('txt-api-key'),
    btnTogglePassword: document.getElementById('btn-toggle-password'),
    txtModelName: document.getElementById('txt-model-name'),
    customUrlGroup: document.getElementById('custom-url-group'),
    txtCustomUrl: document.getElementById('txt-custom-url'),
    
    txtLlmTitle: document.getElementById('txt-llm-title'),
    txtEnableLlm: document.getElementById('txt-enable-llm'),
    txtLlmProvider: document.getElementById('txt-llm-provider'),
    txtApiKeyLabel: document.getElementById('txt-api-key-label'),
    txtModelNameLabel: document.getElementById('txt-model-name-label'),
    txtCustomUrlLabel: document.getElementById('txt-custom-url-label'),
    
    txtOutputTitle: document.getElementById('txt-output-title'),
    txtOutSame: document.getElementById('txt-out-same'),
    txtOutCustom: document.getElementById('txt-out-custom'),
    customDirSection: document.getElementById('custom-dir-section'),
    txtOutputPath: document.getElementById('txt-output-path'),
    btnSelectFolder: document.getElementById('btn-select-folder'),
    txtBrowse: document.getElementById('txt-browse'),
    
    dropzone: document.getElementById('dropzone'),
    txtDropTitle: document.getElementById('txt-drop-title'),
    txtDropSubtitle: document.getElementById('txt-drop-subtitle'),
    btnSelectFiles: document.getElementById('btn-select-files'),
    txtChooseFiles: document.getElementById('txt-choose-files'),
    
    txtQueueTitle: document.getElementById('txt-queue-title'),
    lblQueueCount: document.getElementById('lbl-queue-count'),
    btnClearQueue: document.getElementById('btn-clear-queue'),
    emptyQueueView: document.getElementById('empty-queue-view'),
    txtEmptyMsg: document.getElementById('txt-empty-msg'),
    queueTableView: document.getElementById('queue-table-view'),
    txtColName: document.getElementById('txt-col-name'),
    txtColSize: document.getElementById('txt-col-size'),
    txtColStatus: document.getElementById('txt-col-status'),
    queueBody: document.getElementById('queue-body'),
    
    queueFooter: document.getElementById('queue-footer'),
    txtProgressLabel: document.getElementById('txt-progress-label'),
    lblProgressPercent: document.getElementById('lbl-progress-percent'),
    progressBar: document.getElementById('progress-bar'),
    btnConvertAll: document.getElementById('btn-convert-all'),
    txtConvertBtn: document.getElementById('txt-convert-btn'),
    
    txtConsoleTitle: document.getElementById('txt-console-title'),
    btnClearConsole: document.getElementById('btn-clear-console'),
    consoleLogs: document.getElementById('console-logs')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    applyLanguage();
    setupEventListeners();
});

// Load Settings from LocalStorage
function loadSettings() {
    state.lang = localStorage.getItem('td-lang') || 'en';
    
    const llmEnabled = localStorage.getItem('td-llm-enabled') === 'true';
    elements.chkLlmEnabled.checked = llmEnabled;
    if (llmEnabled) {
        elements.llmFields.classList.remove('hidden');
    }
    
    const provider = localStorage.getItem('td-llm-provider') || 'nvidia';
    elements.selLlmProvider.value = provider;
    updateProviderDefaults(provider);
    
    // Read model name if previously customized
    const savedModel = localStorage.getItem('td-llm-model');
    if (savedModel) elements.txtModelName.value = savedModel;
    
    const savedCustomUrl = localStorage.getItem('td-llm-custom-url');
    if (savedCustomUrl) elements.txtCustomUrl.value = savedCustomUrl;
    
    const outputMode = localStorage.getItem('td-output-mode') || 'same_dir';
    document.querySelector(`input[name="output-mode"][value="${outputMode}"]`).checked = true;
    if (outputMode === 'custom_dir') {
        elements.customDirSection.classList.remove('hidden');
        state.customOutputDir = localStorage.getItem('td-custom-output-dir') || '';
        elements.txtOutputPath.value = state.customOutputDir;
    }
}

// Save Settings to LocalStorage
function saveSettings() {
    localStorage.setItem('td-lang', state.lang);
    localStorage.setItem('td-llm-enabled', elements.chkLlmEnabled.checked);
    localStorage.setItem('td-llm-provider', elements.selLlmProvider.value);
    localStorage.setItem('td-llm-model', elements.txtModelName.value);
    localStorage.setItem('td-llm-custom-url', elements.txtCustomUrl.value);
    
    const outputMode = document.querySelector('input[name="output-mode"]:checked').value;
    localStorage.setItem('td-output-mode', outputMode);
    localStorage.setItem('td-custom-output-dir', state.customOutputDir);
}

// Setup Interactive Handlers
function setupEventListeners() {
    // Language Toggle
    elements.btnLanguage.addEventListener('click', () => {
        state.lang = state.lang === 'en' ? 'es' : 'en';
        saveSettings();
        applyLanguage();
    });

    // LLM Accordion Toggle
    elements.btnLlmAccordion.addEventListener('click', () => {
        elements.btnLlmAccordion.classList.toggle('active');
        elements.llmSettingsContent.classList.toggle('hidden');
    });

    // LLM Enabled Toggle
    elements.chkLlmEnabled.addEventListener('change', (e) => {
        if (e.target.checked) {
            elements.llmFields.classList.remove('hidden');
        } else {
            elements.llmFields.classList.add('hidden');
        }
        saveSettings();
    });

    // LLM Provider Change
    elements.selLlmProvider.addEventListener('change', (e) => {
        updateProviderDefaults(e.target.value);
        saveSettings();
    });

    // Save inputs on change
    elements.txtModelName.addEventListener('change', saveSettings);
    elements.txtCustomUrl.addEventListener('change', saveSettings);

    // Toggle password eye
    elements.btnTogglePassword.addEventListener('click', () => {
        const type = elements.txtApiKey.type === 'password' ? 'text' : 'password';
        elements.txtApiKey.type = type;
        elements.btnTogglePassword.textContent = type === 'password' ? '👁️' : '🔒';
    });

    // Output Mode Radio Change
    document.querySelectorAll('input[name="output-mode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'custom_dir') {
                elements.customDirSection.classList.remove('hidden');
            } else {
                elements.customDirSection.classList.add('hidden');
            }
            saveSettings();
        });
    });

    // Native Select Folder
    elements.btnSelectFolder.addEventListener('click', selectOutputFolder);

    // Native Select Files
    elements.btnSelectFiles.addEventListener('click', selectFilesFromSystem);
    elements.dropzone.addEventListener('click', (e) => {
        // Prevent click if we clicked the nested button which has its own listener
        if (e.target !== elements.btnSelectFiles && !elements.btnSelectFiles.contains(e.target)) {
            selectFilesFromSystem();
        }
    });

    // Drag and Drop implementation
    elements.dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.dropzone.classList.add('dragover');
    });

    elements.dropzone.addEventListener('dragleave', () => {
        elements.dropzone.classList.remove('dragover');
    });

    elements.dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.dropzone.classList.remove('dragover');
        // Drag-and-drop in standard browser does not return local absolute file paths for security.
        // Therefore, we advise using the Choose Files button or log a message.
        // Wait, can we extract file info if dropped? Yes, but standard HTML5 drop only gives file objects,
        // which we'd have to upload. Since the python app runs locally, we show a notice to use the select button
        // for local full-path dialog, OR we can upload files. For simplicity and since we want local system save capabilities,
        // we'll instruct the user to select them or handle web files if needed.
        // To be extremely user-friendly: we will log that selecting files via the button is preferred to keep local path operations,
        // but we can also mock or handle it. Let's write a log.
        logToConsole(getTranslation('logDragOver'), 'info');
        // Let's open the dialog automatically for them to select files!
        selectFilesFromSystem();
    });

    // Convert All Click
    elements.btnConvertAll.addEventListener('click', startQueueConversion);

    // Clear Queue Click
    elements.btnClearQueue.addEventListener('click', () => {
        if (state.isConverting) return;
        state.files = [];
        updateQueueUI();
        logToConsole(getTranslation('logQueueCleared'), 'system');
    });

    // Clear Console Click
    elements.btnClearConsole.addEventListener('click', () => {
        elements.consoleLogs.innerHTML = '';
        logToConsole(getTranslation('logConsoleCleared'), 'system');
    });

    // Easter Egg: Click logo 5 times or press Ctrl + Alt + T
    const logoTrigger = document.getElementById('logo-trigger');
    let logoClicks = 0;
    if (logoTrigger) {
        logoTrigger.addEventListener('click', () => {
            logoClicks++;
            if (logoClicks >= 5) {
                showEasterEgg();
                logoClicks = 0;
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && (e.key === 't' || e.key === 'T')) {
            e.preventDefault();
            showEasterEgg();
        }
    });
}

// Update LLM default placeholders based on provider choice
function updateProviderDefaults(provider) {
    if (provider === 'nvidia') {
        elements.txtApiKey.placeholder = "nvapi-... (Nvidia NIM API Key)";
        elements.txtModelName.placeholder = "meta/llama-3.2-11b-vision-instruct";
        elements.customUrlGroup.classList.add('hidden');
    } else if (provider === 'openai') {
        elements.txtApiKey.placeholder = "sk-proj-... (OpenAI API Key)";
        elements.txtModelName.placeholder = "gpt-4o";
        elements.customUrlGroup.classList.add('hidden');
    } else { // Custom
        elements.txtApiKey.placeholder = "API Key";
        elements.txtModelName.placeholder = "custom-model-id";
        elements.customUrlGroup.classList.remove('hidden');
    }
}

// Apply Language strings to UI
function applyLanguage() {
    const dict = translations[state.lang];
    
    // Header
    elements.txtLangLabel.textContent = dict.langLabel;
    elements.txtSubtitle.textContent = dict.subtitle;
    
    // LLM accordion
    elements.txtLlmTitle.textContent = dict.llmTitle;
    elements.txtEnableLlm.textContent = dict.enableLlm;
    elements.txtLlmProvider.textContent = dict.llmProvider;
    elements.txtApiKeyLabel.textContent = dict.apiKeyLabel;
    elements.txtModelNameLabel.textContent = dict.modelNameLabel;
    elements.txtCustomUrlLabel.textContent = dict.customUrlLabel;
    
    // Output settings
    elements.txtOutputTitle.textContent = dict.outputTitle;
    elements.txtOutSame.textContent = dict.outSame;
    elements.txtOutCustom.textContent = dict.outCustom;
    elements.txtBrowse.textContent = dict.browse;
    
    // Dropzone
    elements.txtDropTitle.textContent = dict.dropTitle;
    elements.txtDropSubtitle.textContent = dict.dropSubtitle;
    elements.txtChooseFiles.textContent = dict.chooseFiles;
    
    // Queue
    elements.txtQueueTitle.textContent = dict.queueTitle;
    elements.btnClearQueue.textContent = dict.clearAll;
    elements.txtEmptyMsg.textContent = dict.emptyMsg;
    elements.txtColName.textContent = dict.colName;
    elements.txtColSize.textContent = dict.colSize;
    elements.txtColStatus.textContent = dict.colStatus;
    
    // Queue Footer
    elements.txtProgressLabel.textContent = dict.progressLabel;
    elements.txtConvertBtn.textContent = dict.convertBtn;
    
    // Console
    elements.txtConsoleTitle.textContent = dict.consoleTitle;
    
    // Refresh queue UI to translate active labels
    updateQueueUI();
}

// Helper to get active translations
function getTranslation(key) {
    return translations[state.lang][key] || key;
}

// Console Logging Helper
function logToConsole(message, type = 'info') {
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.textContent = message;
    elements.consoleLogs.appendChild(line);
    elements.consoleLogs.scrollTop = elements.consoleLogs.scrollHeight;
}

// Format bytes to readable size
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Trigger Select Folder native Dialog
async function selectOutputFolder() {
    if (state.isConverting) return;
    try {
        logToConsole("Opening folder dialog...", "info");
        const response = await fetch('/api/select-folder');
        const data = await response.json();
        
        if (data.folder) {
            state.customOutputDir = data.folder;
            elements.txtOutputPath.value = data.folder;
            saveSettings();
            
            const msg = getTranslation('logSelectFolder').replace('{path}', data.folder);
            logToConsole(msg, 'success');
        } else {
            logToConsole(getTranslation('logSelectFolderCancel'), 'info');
        }
    } catch (err) {
        logToConsole(`[Error] Folder dialog failed: ${err.message}`, 'error');
    }
}

// Trigger Select Files native Dialog
async function selectFilesFromSystem() {
    if (state.isConverting) return;
    try {
        logToConsole("Opening file dialog...", "info");
        const response = await fetch('/api/select-files');
        const data = await response.json();
        
        if (data.files && data.files.length > 0) {
            // Append only non-duplicate paths
            let addedCount = 0;
            data.files.forEach(f => {
                if (!state.files.some(existing => existing.path === f.path)) {
                    state.files.push({
                        path: f.path,
                        name: f.name,
                        size: f.size,
                        type: f.type,
                        status: 'pending', // pending, converting, success, error
                        error: null
                    });
                    addedCount++;
                }
            });
            
            updateQueueUI();
            
            const msg = getTranslation('logSelectFiles').replace('{count}', addedCount);
            logToConsole(msg, 'success');
        }
    } catch (err) {
        logToConsole(`[Error] File dialog failed: ${err.message}`, 'error');
    }
}

// Redraw Queue Table & Empty States
function updateQueueUI() {
    if (state.files.length === 0) {
        elements.emptyQueueView.classList.remove('hidden');
        elements.queueTableView.classList.add('hidden');
        elements.queueFooter.classList.add('hidden');
        elements.btnClearQueue.classList.add('hidden');
        elements.lblQueueCount.textContent = '0';
        return;
    }

    elements.emptyQueueView.classList.add('hidden');
    elements.queueTableView.classList.remove('hidden');
    elements.queueFooter.classList.remove('hidden');
    elements.btnClearQueue.classList.remove('hidden');
    elements.lblQueueCount.textContent = state.files.length;

    // Clear previous rows
    elements.queueBody.innerHTML = '';

    // Populate rows
    state.files.forEach((file, index) => {
        const row = document.createElement('tr');
        row.className = 'file-row';
        
        // Icon based on type
        const fileIconSvg = getFileIconSvg(file.type);
        
        // Status Badge content
        let statusBadge = '';
        if (file.status === 'pending') {
            statusBadge = `<span class="status-badge pending">${getTranslation('statusPending')}</span>`;
        } else if (file.status === 'converting') {
            statusBadge = `<span class="status-badge converting"><div class="spinner"></div> ${getTranslation('statusConverting')}</span>`;
        } else if (file.status === 'success') {
            statusBadge = `<span class="status-badge success">✓ ${getTranslation('statusSuccess')}</span>`;
        } else if (file.status === 'error') {
            statusBadge = `<span class="status-badge error" title="${file.error || ''}">✗ ${getTranslation('statusError')}</span>`;
        }

        row.innerHTML = `
            <td>
                <div class="file-name" title="${file.path}">
                    ${fileIconSvg}
                    <span>${file.name}</span>
                </div>
            </td>
            <td><span class="file-size">${formatBytes(file.size)}</span></td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn-remove-file" data-index="${index}" ${state.isConverting ? 'disabled' : ''}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </td>
        `;
        
        elements.queueBody.appendChild(row);
    });

    // Attach remove event listeners
    document.querySelectorAll('.btn-remove-file').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.getAttribute('data-index'));
            state.files.splice(idx, 1);
            updateQueueUI();
            updateProgressStats();
        });
    });

    updateProgressStats();
}

// Generate inline SVG icon depending on extension
function getFileIconSvg(extension) {
    const ext = extension.toLowerCase();
    let strokeColor = "currentColor";
    if (ext === '.pdf') strokeColor = "#f87171"; // Red
    else if (ext === '.docx' || ext === '.doc') strokeColor = "#60a5fa"; // Blue
    else if (ext === '.xlsx' || ext === '.xls') strokeColor = "#34d399"; // Green
    else if (ext === '.pptx' || ext === '.ppt') strokeColor = "#fb923c"; // Orange
    
    return `
        <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" width="16" height="16">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
    `;
}

// Calculate and update progress bar
function updateProgressStats() {
    if (state.files.length === 0) return;
    const completed = state.files.filter(f => f.status === 'success' || f.status === 'error').length;
    const percent = Math.round((completed / state.files.length) * 100);
    elements.lblProgressPercent.textContent = `${percent}%`;
    elements.progressBar.style.width = `${percent}%`;
}

// Lock / Unlock inputs during conversion
function setUIStateLocked(locked) {
    state.isConverting = locked;
    elements.btnSelectFiles.disabled = locked;
    elements.btnSelectFolder.disabled = locked;
    elements.btnConvertAll.disabled = locked;
    elements.btnClearQueue.disabled = locked;
    elements.chkLlmEnabled.disabled = locked;
    elements.selLlmProvider.disabled = locked;
    elements.txtApiKey.disabled = locked;
    elements.txtModelName.disabled = locked;
    elements.txtCustomUrl.disabled = locked;
    
    document.querySelectorAll('input[name="output-mode"]').forEach(r => r.disabled = locked);
    document.querySelectorAll('.btn-remove-file').forEach(btn => btn.disabled = locked);
    
    if (locked) {
        elements.btnConvertAll.classList.remove('btn-glow');
        elements.btnConvertAll.style.opacity = '0.6';
    } else {
        elements.btnConvertAll.classList.add('btn-glow');
        elements.btnConvertAll.style.opacity = '1';
    }
}

// Sequential queue execution
async function startQueueConversion() {
    if (state.files.length === 0) {
        logToConsole(getTranslation('logNoFiles'), 'error');
        return;
    }
    if (state.isConverting) return;

    setUIStateLocked(true);
    
    // Clear previous execution statuses (except if user already succeeded, let's reset all to pending to start fresh)
    state.files.forEach(f => {
        f.status = 'pending';
        f.error = null;
    });
    updateQueueUI();

    const count = state.files.length;
    const startMsg = getTranslation('logConvertStart').replace('{count}', count);
    logToConsole(startMsg, 'system');

    // Retrieve settings
    const outputMode = document.querySelector('input[name="output-mode"]:checked').value;
    const llmEnabled = elements.chkLlmEnabled.checked;
    const llmProvider = elements.selLlmProvider.value;
    const llmApiKey = elements.txtApiKey.value;
    const llmModel = elements.txtModelName.value;
    const llmBaseUrl = elements.txtCustomUrl.value;

    let successCount = 0;

    for (let i = 0; i < state.files.length; i++) {
        const file = state.files[i];
        file.status = 'converting';
        updateQueueUI();
        
        const convFileMsg = getTranslation('logConvertingFile').replace('{name}', file.name);
        logToConsole(convFileMsg, 'info');

        try {
            const reqBody = {
                filepath: file.path,
                output_mode: outputMode,
                output_dir: state.customOutputDir,
                llm_enabled: llmEnabled,
                llm_provider: llmProvider,
                llm_api_key: llmApiKey,
                llm_model: llmModel,
                llm_base_url: llmBaseUrl
            };

            const response = await fetch('/api/convert-file', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqBody)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || `HTTP Error ${response.status}`);
            }

            const resData = await response.json();
            file.status = 'success';
            successCount++;
            
            const successMsg = getTranslation('logConvertedSuccess')
                .replace('{name}', file.name)
                .replace('{path}', resData.output_path);
            logToConsole(successMsg, 'success');

        } catch (err) {
            file.status = 'error';
            file.error = err.message;
            
            const errMsg = getTranslation('logConvertedError')
                .replace('{name}', file.name)
                .replace('{error}', err.message);
            logToConsole(errMsg, 'error');
        }

        updateQueueUI();
    }

    setUIStateLocked(false);
    
    const finishMsg = getTranslation('logConvertFinish')
        .replace('{success}', successCount)
        .replace('{total}', count);
    logToConsole(finishMsg, 'system');
}

// Easter Egg modal activation
function showEasterEgg() {
    const modal = document.getElementById('easter-egg-modal');
    const closeBtn = document.getElementById('btn-close-easter-egg');
    if (modal && closeBtn) {
        modal.classList.remove('hidden');
        logToConsole("[System] Decrypting developer logs... dtmadman detected.", "system");
        
        const closeHandler = () => {
            modal.classList.add('hidden');
            closeBtn.removeEventListener('click', closeHandler);
            modal.removeEventListener('click', outsideClickHandler);
        };
        
        const outsideClickHandler = (e) => {
            if (e.target === modal) {
                closeHandler();
            }
        };
        
        closeBtn.addEventListener('click', closeHandler);
        modal.addEventListener('click', outsideClickHandler);
    }
}
