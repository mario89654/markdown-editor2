document.addEventListener("DOMContentLoaded", () => {
    const previewBtn = document.querySelector("#previewBtn");
    const contrastBtn = document.querySelector("#contrastBtn");
    const themeSelect = document.createElement("select");
    const clearBtn = document.createElement("button");
    const markdownInput = document.querySelector("#editor");
    const previewSection = document.querySelector("#preview");
    const charCount = document.querySelector("#charCount");
    const wordCount = document.createElement("p");
    wordCount.id = "wordCount";
    wordCount.classList.add("text-gray-500", "text-sm", "mt-1");
    charCount.insertAdjacentElement("afterend", wordCount);
    
    let isContrastApplied = false;

    const editorPlaceholder = "Escribí tu código Markdown aquí...";
    const previewPlaceholder = "Vista previa de HTML";

    if (!markdownInput.value.trim()) {
        markdownInput.value = editorPlaceholder;
        markdownInput.classList.add("text-gray-500");
    }
    previewSection.innerHTML = `<p class="text-gray-500 text-sm">${previewPlaceholder}</p>`;

    markdownInput.addEventListener("focus", () => {
        if (markdownInput.value === editorPlaceholder) {
            markdownInput.value = "";
            markdownInput.classList.remove("text-gray-500");
        }
    });

    markdownInput.addEventListener("blur", () => {
        if (!markdownInput.value.trim()) {
            markdownInput.value = editorPlaceholder;
            markdownInput.classList.add("text-gray-500");
        }
    });

    function updateCounts() {
        const text = markdownInput.value.trim();
        charCount.textContent = `Caracteres: ${text.length}`;
        wordCount.textContent = `Palabras: ${text ? text.split(/\s+/).filter(word => word.length > 0).length : 0}`;
    }
    markdownInput.addEventListener("input", updateCounts);

    function convertToHtml(text) {
        return text
            .replace(/^###### (.+)$/gm, "<h6 class='text-xl font-bold'>$1</h6>")
            .replace(/^##### (.+)$/gm, "<h5 class='text-2xl font-bold'>$1</h5>")
            .replace(/^#### (.+)$/gm, "<h4 class='text-3xl font-bold'>$1</h4>")
            .replace(/^### (.+)$/gm, "<h3 class='text-4xl font-bold'>$1</h3>")
            .replace(/^## (.+)$/gm, "<h2 class='text-5xl font-bold'>$1</h2>")
            .replace(/^# (.+)$/gm, "<h1 class='text-6xl font-bold'>$1</h1>")
            .replace(/(?:^|\n)- (.+)/g, "<ul><li>$1</li></ul>")
            .replace(/(?:^|\n)\d+\. (.+)/g, "<ol><li>$1</li></ol>")
            .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>");
    }

    function renderPreview(html) {
        previewSection.innerHTML = html || `<p class="text-gray-500 text-sm">${previewPlaceholder}</p>`;
    }

    markdownInput.addEventListener("input", () => {
        const text = markdownInput.value;
        if (text !== editorPlaceholder) {
            renderPreview(convertToHtml(text));
        } else {
            renderPreview("");
        }
    });

    previewBtn.addEventListener("click", () => {
        const text = markdownInput.value;
        if (text !== editorPlaceholder) {
            renderPreview(convertToHtml(text));
        } else {
            renderPreview("");
        }
    });

    contrastBtn.addEventListener("click", () => {
        previewSection.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(header => {
            header.classList.toggle("contrast");
        });
        isContrastApplied = !isContrastApplied;
    });

    clearBtn.textContent = "Limpiar";
    clearBtn.id = "clearBtn";
    clearBtn.classList.add("bg-red-500", "text-white", "px-4", "py-2", "rounded", "mt-2", "transition-all", "duration-300", "hover:bg-red-400");
    markdownInput.insertAdjacentElement("afterend", clearBtn);

    clearBtn.addEventListener("click", () => {
        markdownInput.value = "";
        previewSection.innerHTML = `<p class="text-gray-500 text-sm">${previewPlaceholder}</p>`;
        updateCounts();
    });

    themeSelect.innerHTML = `
        <option value="light">Claro</option>
        <option value="dark">Oscuro</option>
    `;
    themeSelect.classList.add("bg-cyan-500", "text-white", "px-4", "py-2", "rounded-lg", "mt-2", "transition-all", "duration-300", "hover:bg-cyan-600");
    document.querySelector("header").appendChild(themeSelect);

    themeSelect.addEventListener("change", (event) => {
        document.body.classList.toggle("dark-theme", event.target.value === "dark");
    });

    const style = document.createElement("style");
    style.innerHTML = `
        .contrast {
            color: #ff5733 !important;
            background-color: #000 !important;
            padding: 5px !important;
            border-radius: 5px !important;
        }
        .dark-theme {
            background-color: #1e1e1e;
            color: white;
        }
        .dark-theme #editor {
            background-color: #333;
            color: white;
        }
        @media screen and (max-width: 768px) {
            body {
                font-size: 16px;
            }
            #editor {
                width: 100%;
                min-height: 150px;
            }
            #preview {
                width: 100%;
                padding: 10px;
                overflow-x: auto;
            }
            button {
                width: 100%;
                margin-top: 10px;
            }
        }
    `;
    document.head.appendChild(style);

    updateCounts();
});
