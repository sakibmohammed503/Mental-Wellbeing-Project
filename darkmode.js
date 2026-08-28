// ============================================
// MINDFUL WELL-BEING PLATFORM - UNIFIED THEME CONTROLLER
// Handles dark mode, theme presets, custom colors, and universal Theme Studio Modal
// ============================================

(function () {
    const THEME_MODE_KEY = "mindful-theme";
    const THEME_PRESET_KEY = "mindful_theme_preset_v2";
    const THEME_COLOR_KEY = "mindful_custom_primary_color";

    function applyThemeMode(theme) {
        if (theme === "dark") {
            document.body.classList.add("dark-mode");
            document.documentElement.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
            document.documentElement.classList.remove("dark-mode");
        }
    }

    function applyThemePreset(preset) {
        if (!preset) preset = "ocean";
        document.body.setAttribute("data-theme-preset", preset);
        document.documentElement.setAttribute("data-theme-preset", preset);
    }

    function applyCustomColor(color) {
        if (color) {
            document.documentElement.style.setProperty("--primary", color);
            document.documentElement.style.setProperty("--primary-dark", color);
            document.documentElement.style.setProperty("--primary-glow", color + "33");
            document.body.style.setProperty("--primary", color);
            document.body.style.setProperty("--primary-dark", color);
            document.body.style.setProperty("--primary-glow", color + "33");
        } else {
            document.documentElement.style.removeProperty("--primary");
            document.documentElement.style.removeProperty("--primary-dark");
            document.documentElement.style.removeProperty("--primary-glow");
            document.body.style.removeProperty("--primary");
            document.body.style.removeProperty("--primary-dark");
            document.body.style.removeProperty("--primary-glow");
        }
    }

    // Apply saved settings immediately (before render)
    const savedMode = localStorage.getItem(THEME_MODE_KEY) || "light";
    const savedPreset = localStorage.getItem(THEME_PRESET_KEY) || "ocean";
    const savedColor = localStorage.getItem(THEME_COLOR_KEY);

    applyThemeMode(savedMode);
    applyThemePreset(savedPreset);
    if (savedColor) applyCustomColor(savedColor);

    function createThemeModalIfNotExists() {
        let modal = document.getElementById("themeModal");
        if (modal) {
            bindThemeModalEvents(modal);
            return modal;
        }

        modal = document.createElement("div");
        modal.id = "themeModal";
        modal.className = "modal-backdrop hidden";
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.innerHTML = `
            <div class="theme-modal-card">
                <div class="modal-header">
                    <h3 id="themeModalTitle">🎨 Theme Studio & Aesthetics Builder</h3>
                    <button type="button" id="closeThemeModalBtn" class="close-modal-btn" aria-label="Close Theme Studio">✕</button>
                </div>
                <p class="modal-desc">Personalize your visual experience. Choose a curated color harmony or customize individual accent colors with live preview.</p>

                <div class="theme-presets-grid">
                    <button type="button" class="theme-preset-card ${savedPreset === 'ocean' ? 'active' : ''}" data-preset="ocean">
                        <span class="theme-palette"><span style="background:#007bff"></span><span style="background:#4a90e2"></span><span style="background:#0056b3"></span></span>
                        <b>Ocean Serenity</b>
                        <small>Vibrant cyan & deep blue</small>
                    </button>
                    <button type="button" class="theme-preset-card ${savedPreset === 'forest' ? 'active' : ''}" data-preset="forest">
                        <span class="theme-palette"><span style="background:#10b981"></span><span style="background:#059669"></span><span style="background:#064e3b"></span></span>
                        <b>Calm Forest</b>
                        <small>Sage, emerald & pine</small>
                    </button>
                    <button type="button" class="theme-preset-card ${savedPreset === 'sunset' ? 'active' : ''}" data-preset="sunset">
                        <span class="theme-palette"><span style="background:#f97316"></span><span style="background:#ec4899"></span><span style="background:#be185d"></span></span>
                        <b>Sunset Horizon</b>
                        <small>Warm amber & coral</small>
                    </button>
                    <button type="button" class="theme-preset-card ${savedPreset === 'midnight' ? 'active' : ''}" data-preset="midnight">
                        <span class="theme-palette"><span style="background:#8b5cf6"></span><span style="background:#6366f1"></span><span style="background:#0f172a"></span></span>
                        <b>Midnight OLED</b>
                        <small>Neon violet & indigo</small>
                    </button>
                    <button type="button" class="theme-preset-card ${savedPreset === 'lavender' ? 'active' : ''}" data-preset="lavender">
                        <span class="theme-palette"><span style="background:#a855f7"></span><span style="background:#d946ef"></span><span style="background:#701a75"></span></span>
                        <b>Lavender Peace</b>
                        <small>Pastel lilac & periwinkle</small>
                    </button>
                </div>

                <div class="custom-color-controls">
                    <div class="color-picker-row">
                        <label for="customPrimaryColor">Custom Accent Color:</label>
                        <input type="color" id="customPrimaryColor" value="${savedColor || '#007bff'}">
                    </div>
                </div>

                <div class="modal-actions">
                    <button type="button" id="resetThemeDefaultBtn" class="linklike-btn">Reset to Default</button>
                    <button type="button" id="saveThemeBtn" class="submit-btn small">Done</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        bindThemeModalEvents(modal);
        return modal;
    }

    function bindThemeModalEvents(modal) {
        if (!modal || modal.dataset.bound === "true") return;
        modal.dataset.bound = "true";

        const closeBtn = modal.querySelector("#closeThemeModalBtn");
        const saveBtn = modal.querySelector("#saveThemeBtn");
        const resetBtn = modal.querySelector("#resetThemeDefaultBtn");
        const colorPicker = modal.querySelector("#customPrimaryColor");
        const presetCards = modal.querySelectorAll(".theme-preset-card");

        if (closeBtn) {
            closeBtn.onclick = function () { modal.classList.add("hidden"); };
        }
        if (saveBtn) {
            saveBtn.onclick = function () { modal.classList.add("hidden"); };
        }

        modal.onclick = function (e) {
            if (e.target === modal) modal.classList.add("hidden");
        };

        presetCards.forEach(function (card) {
            card.onclick = function () {
                presetCards.forEach(function (c) { c.classList.remove("active"); });
                card.classList.add("active");
                const preset = card.getAttribute("data-preset");
                applyThemePreset(preset);
                applyCustomColor(null);
                localStorage.setItem(THEME_PRESET_KEY, preset);
                localStorage.removeItem(THEME_COLOR_KEY);
                window.dispatchEvent(new CustomEvent("themechange", { detail: { preset: preset } }));
            };
        });

        if (colorPicker) {
            colorPicker.oninput = function (e) {
                const color = e.target.value;
                applyCustomColor(color);
                localStorage.setItem(THEME_COLOR_KEY, color);
                window.dispatchEvent(new CustomEvent("themechange", { detail: { color: color } }));
            };
        }

        if (resetBtn) {
            resetBtn.onclick = function () {
                applyThemePreset("ocean");
                applyCustomColor(null);
                localStorage.removeItem(THEME_PRESET_KEY);
                localStorage.removeItem(THEME_COLOR_KEY);
                presetCards.forEach(function (c) {
                    c.classList.toggle("active", c.getAttribute("data-preset") === "ocean");
                });
                if (colorPicker) colorPicker.value = "#007bff";
                window.dispatchEvent(new CustomEvent("themechange", { detail: { preset: "ocean" } }));
            };
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        const toggleBtn = document.getElementById("themeToggleBtn");
        if (toggleBtn) {
            const currentMode = (localStorage.getItem(THEME_MODE_KEY) || "light");
            toggleBtn.textContent = currentMode === "dark" ? "☀️" : "🌙";
            toggleBtn.onclick = function () {
                const isDark = document.body.classList.contains("dark-mode");
                const newMode = isDark ? "light" : "dark";
                applyThemeMode(newMode);
                localStorage.setItem(THEME_MODE_KEY, newMode);
                toggleBtn.textContent = newMode === "dark" ? "☀️" : "🌙";
                window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: newMode } }));
            };
        }

        const customizerBtn = document.getElementById("themeCustomizerBtn");
        if (customizerBtn) {
            customizerBtn.onclick = function () {
                const modal = createThemeModalIfNotExists();
                modal.classList.remove("hidden");
            };
        }

        const existingModal = document.getElementById("themeModal");
        if (existingModal) {
            bindThemeModalEvents(existingModal);
        }

        // Global Alt + T Shortcut for Theme Toggle across all pages
        document.addEventListener("keydown", function (e) {
            if (e.altKey && ((e.key && e.key.toLowerCase() === "t") || e.code === "KeyT")) {
                e.preventDefault();
                if (toggleBtn) {
                    toggleBtn.click();
                } else {
                    const isDark = document.body.classList.contains("dark-mode");
                    const newMode = isDark ? "light" : "dark";
                    applyThemeMode(newMode);
                    localStorage.setItem(THEME_MODE_KEY, newMode);
                    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: newMode } }));
                }
            }
        });
    });
})();
