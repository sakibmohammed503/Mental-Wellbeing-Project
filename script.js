// Screen Toggle Elements
const welcomeScreen = document.getElementById("welcomeScreen");
const formScreen = document.getElementById("formScreen");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

function safeAddListener(el, ev, fn) {
    if (el) el.addEventListener(ev, fn);
}

function animateShow(el, readyClass) {
    if (!el) return;
    console.debug('animateShow:', el.id || el.className, 'readyClass=', readyClass);
    // if element hidden via display:none, remove hidden then animate
    el.classList.remove('hidden');
    // clear any forced inline hide styles
    el.style.display = '';
    el.style.opacity = '';
    // small timeout to allow layout
    requestAnimationFrame(() => {
        el.classList.remove('animate-out');
        el.classList.add('animate-in');
        if (readyClass) el.classList.add(readyClass);
    });
}

function animateHide(el) {
    if (!el) return;
    console.debug('animateHide start:', el.id || el.className, 'classes=', el.className);
    el.classList.remove('animate-in');
    el.classList.add('animate-out');
    // store the handler so it can be skipped or removed if needed
    const handler = function() {
        // if preventHide flag present, skip hiding
        if (el.dataset && el.dataset.preventHide === 'true') {
            el.classList.remove('animate-out');
            el.removeEventListener('animationend', handler);
            delete el.__hideHandler;
            return;
        }
        el.classList.add('hidden');
        el.classList.remove('animate-out');
        el.removeEventListener('animationend', handler);
        delete el.__hideHandler;
    };
    el.__hideHandler = handler;
    el.addEventListener('animationend', handler);
    console.debug('animateHide registered handler for', el.id || el.className);
}

// 1. Click "Start Assessment" to hide Welcome Screen and show Form
safeAddListener(startBtn, "click", function() {
    if (welcomeScreen) animateHide(welcomeScreen);
    animateShow(formScreen, 'animate-in');
});

// 2. Handle Form Submission
safeAddListener(document.getElementById("predictionForm"), "submit", async function(event) {
    event.preventDefault();

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

    let riskLabel;
    try {
        const response = await fetch("http://127.0.0.1:5000/api/assess", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
        const result = await response.json();
        if (!response.ok) {
            console.error("Backend error:", result.error);
            alert("Something went wrong: " + result.error);
            return;
        }
        riskLabel = result.prediction;
    } catch (err) {
        console.error("Network error:", err);
        alert("Could not reach the server. Make sure the Flask backend is running.");
        return;
    }

     let resultBox = document.getElementById("resultBox");
    let resultText = document.getElementById("resultText");

    if (!resultBox) return;

    if (riskLabel === "High Risk") {
        resultBox.classList.remove("low-risk");
        resultBox.classList.add("high-risk");
        resultText.innerHTML = "<strong>Mental Well-being Level: High Risk</strong><br>Consider reducing late-night screen time and improving sleep habits.";
    } else {
        resultBox.classList.remove("high-risk");
        resultBox.classList.add("low-risk");
        resultText.innerHTML = "<strong>Mental Well-being Level: Low Risk</strong><br>Great job maintaining a healthy routine!";
    }

    // Hide the form immediately (no animation dependency, so nothing can race)
    if (formScreen) {
        formScreen.classList.remove('animate-in', 'animate-out');
        formScreen.classList.add('hidden');
        formScreen.style.display = 'none';
        formScreen.style.opacity = '0';
    }

    // Show the result box — one single, direct show, no re-trigger later
    resultBox.classList.remove('hidden');
    resultBox.style.display = '';
    resultBox.style.opacity = '1';
    resultBox.style.zIndex = '30';
    resultBox.focus();
});

// 3. Click "Check Again" to reset the page back to welcome screen
safeAddListener(restartBtn, "click", function() {
    // Simple, deterministic reset: clear form, hide result, show form immediately (no animations)
    const form = document.getElementById("predictionForm");
    if (form) form.reset();

    const resultBox = document.getElementById("resultBox");
    if (resultBox) {
        if (resultBox.__hideHandler) {
            resultBox.removeEventListener('animationend', resultBox.__hideHandler);
            delete resultBox.__hideHandler;
        }
        resultBox.classList.remove('animate-in', 'animate-out', 'high-risk', 'low-risk');
        resultBox.classList.add('hidden');
        resultBox.style.display = 'none';
        resultBox.style.opacity = '0';
        resultBox.style.zIndex = '';
    }

    if (formScreen) {
        if (formScreen.__hideHandler) {
            formScreen.removeEventListener('animationend', formScreen.__hideHandler);
            delete formScreen.__hideHandler;
        }
        formScreen.classList.remove('hidden', 'animate-out', 'animate-in');
        formScreen.style.display = '';
        formScreen.style.opacity = '';
    }

    // focus first input quickly
    setTimeout(() => {
        const firstInput = document.querySelector('#predictionForm input, #predictionForm select');
        if (firstInput) firstInput.focus();
    }, 40);
});

// Entrance animations for page elements
document.addEventListener('DOMContentLoaded', function() {
    // hero entrance
    const hero = document.querySelector('.hero-blue-box');
    if (hero) {
        hero.classList.add('animate-ready');
        // stagger: add animate-in class after slight delay
        setTimeout(() => hero.classList.add('animate-in'), 80);
    }
    // form card
    const formCard = document.querySelector('.form-card');
    if (formCard && !formCard.classList.contains('hidden')) {
        formCard.classList.add('animate-in');
    }
});
