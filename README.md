# Samajh

**Every official letter, made clear.**

Paste any confusing notice (electricity, bank, tax, court, college). Samajh explains what it means, pulls out the deadline and amount, rates the urgency, gives a step-by-step plan, and warns about common scam patterns. Answers are available in English and Hindi.

## Why
People miss deadlines and pay agents just to be told what a letter says. Samajh makes that understanding free and instant.

## How it works
Samajh runs fully in the browser (HTML, CSS, JavaScript). It detects the letter type, extracts amounts and deadlines with pattern matching, scores urgency from risk keywords, checks for scam patterns, and returns a localized action plan. Nothing is uploaded, so the letter stays private.

## Files
- `index.html`: page structure
- `style.css`: design
- `script.js`: analysis and rendering
- `README.md`: this file

## Run locally
Open `index.html` in a browser. No install needed.

## Deploy (GitHub Pages)
1. Push these files to a public GitHub repo.
2. Repo Settings > Pages > Source: `main` branch, `/ (root)`.
3. Your site goes live at `https://YOUR_USERNAME.github.io/REPO_NAME/`.

## Roadmap
- LLM-powered explanations for any letter type (e.g. via DigitalOcean Gradient AI)
- Photo upload with OCR
- WhatsApp bot
- More Indian languages and voice read-out

## Disclaimer
Samajh is a reading aid, not legal advice.
