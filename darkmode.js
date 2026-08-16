// ============================================
// DARK MODE TOGGLE — add this file to every page
// Remembers the user's choice across all pages using localStorage
// ============================================

(function () {
    const STORAGE_KEY = "mindful-theme";

    function applyTheme(theme) {
        if (theme === "dark") {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }

    // Apply saved theme as soon as possible (before page fully renders)
    const savedTheme = localStorage.getItem(STORAGE_KEY) || "light";
    applyTheme(savedTheme);

    document.addEventListener("DOMContentLoaded", function () {
        const toggleBtn = document.getElementById("themeToggleBtn");
        if (!toggleBtn) return;

        // Set correct icon on load
        toggleBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";

        toggleBtn.addEventListener("click", function () {
            const isDark = document.body.classList.contains("dark-mode");
            const newTheme = isDark ? "light" : "dark";
            applyTheme(newTheme);
            localStorage.setItem(STORAGE_KEY, newTheme);
            toggleBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
        });
    });
})();
