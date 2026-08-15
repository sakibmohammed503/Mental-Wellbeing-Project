# Mental Wellbeing App

Simple static site for a Mental Well-being risk predictor.

## Overview
This repository contains a small static website (HTML, CSS, JS) that provides an assessment UI and a lightweight prediction model (local JS). Use it for demonstration or educational purposes.

## Files
- `index.html` — Home page + assessment form
- `about.html`, `services.html`, `contact.html`, `support.html` — Site pages
- `style.css` — Site styles
- `script.js` — UI behaviour and animations
- `model.js` — Prediction logic (client-side)

## Run locally
No build step required. Open `index.html` in a browser or run a local static server:

```powershell
# using Python 3
cd /d "e:\files\Mental_Wellbeing_App"
python -m http.server 8000
# open http://localhost:8000
```

## Git / GitHub
Initialize and push this workspace to GitHub (replace URL with your repo):

```powershell
cd /d "e:\files\Mental_Wellbeing_App"
git init
git add .
git commit -m "Initial commit: site updates"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Or create & push with GitHub CLI if installed:

```powershell
gh repo create USERNAME/REPO --public --source=. --remote=origin --push
```

## Notes
- This project is a static demo; no server-side processing is included.
- If you want me to push to GitHub directly, provide a repo URL or grant access via `gh` (I can only provide commands here).