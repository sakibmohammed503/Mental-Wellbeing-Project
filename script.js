document.addEventListener("DOMContentLoaded", function () {
    const welcomeScreen = document.getElementById("welcomeScreen");
    const formScreen = document.getElementById("formScreen");
    const startBtn = document.getElementById("startBtn");
    const restartBtn = document.getElementById("restartBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const predictionForm = document.getElementById("predictionForm");
    const resultBox = document.getElementById("resultBox");
    const resultText = document.getElementById("resultText");

    // 1. Click "Start Assessment"
    if (startBtn) {
        startBtn.addEventListener("click", function () {
            if (welcomeScreen) welcomeScreen.classList.add("hidden");
            if (formScreen) formScreen.classList.remove("hidden");
        });
    }

    // 2. Handle Form Submission
    if (predictionForm) {
        predictionForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // STOP PAGE RELOAD

            const submitBtn = predictionForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "Analyzing Data...";
            }

            let userData = {
                age: parseInt(document.getElementById("age").value),
                gender: document.getElementById("gender").value,
                social_media_hours: parseFloat(document.getElementById("socialHours").value),
                sessions_per_day: parseInt(document.getElementById("sessions").value),
                average_session_length_minutes: parseFloat(document.getElementById("avgLength").value),
                late_night_usage: document.getElementById("lateNight").value,
                short_video_hours: parseFloat(document.getElementById("shortVideo").value),
                sleep_hours: parseFloat(document.getElementById("sleepHours").value),
                study_hours_per_week: parseFloat(document.getElementById("studyHours").value),
                digital_addiction_score: parseFloat(document.getElementById("addictionScore").value)
            };

            try {
                const response = await fetch("https://mental-wellbeing-project.onrender.com/api/assess", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();

                if (!response.ok) {
                    alert("Backend error: " + (result.error || "Unknown error"));
                    return;
                }

                let riskLabel = result.prediction;

                if (resultBox && resultText) {
                    if (riskLabel === "High Risk") {
                        resultBox.classList.remove("low-risk");
                        resultBox.classList.add("high-risk");
                        resultText.innerHTML = "<strong>Mental Well-being Level: High Risk</strong><br>Consider reducing late-night screen time and improving sleep habits.";
                    } else {
                        resultBox.classList.remove("high-risk");
                        resultBox.classList.add("low-risk");
                        resultText.innerHTML = "<strong>Mental Well-being Level: Low Risk</strong><br>Great job maintaining a healthy routine!";
                    }

                    // Hide form and show result
                    if (formScreen) formScreen.classList.add("hidden");
                    resultBox.classList.remove("hidden");
                    resultBox.style.display = "block";
                }

            } catch (error) {
                console.error("Fetch Error:", error);
                alert("Server is starting up or unreachable. Please wait 15 seconds and try again.");
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = "Predict Mental Well-being →";
                }
            }
        });
    }

    // 3. Click "Check Again"
    if (restartBtn) {
        restartBtn.addEventListener("click", function () {
            if (predictionForm) predictionForm.reset();
            if (resultBox) {
                resultBox.classList.add("hidden");
                resultBox.style.display = "none";
            }
            if (formScreen) formScreen.classList.remove("hidden");
            if (downloadBtn) downloadBtn.classList.remove("hidden");
        });
    }

    // 4. Click "Download" — hide button after click
    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {
            setTimeout(function () {
                downloadBtn.classList.add("hidden");
            }, 300);
        });
    }
});