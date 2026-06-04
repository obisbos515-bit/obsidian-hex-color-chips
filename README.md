# Hex Color Chips for Obsidian

Render hex color codes such as `#0A2E5C` as small inline color chips instead of letting them look like plain tags.

This project is a beginner-friendly MVP:

- It is written in plain JavaScript, so there is no build step.
- It is ready to test locally in Obsidian.
- It is simple to upload to GitHub when you are ready.

## What it does

- Replaces rendered hex tags like `#0A2E5C` with a visual chip in Reading view.
- Styles matching hex tokens in Live Preview when Obsidian exposes them as hashtag tokens.
- Supports 3, 4, 6, and 8 digit hex values such as `#FFF`, `#FFFF`, `#0A2E5C`, and `#0A2E5CCC`.


## Install Locally In Obsidian

1. Open Obsidian.
2. Go to `Settings -> Community plugins`.
3. Turn off Safe mode if Obsidian asks.
4. Click `Open plugins folder`.
5. Create a folder named `hex-color-chips`.
6. Copy these four files into that folder:
   - `manifest.json`
   - `main.js`
   - `styles.css`
   - `versions.json`
7. Go back to `Settings -> Community plugins`.
8. Click `Reload plugins` if needed.
9. Enable `Hex Color Chips`.

## Notes

- This is an MVP, so the best-supported experience is Reading view.
- In Live Preview, the line you are actively editing stays as raw text so the hex value remains easy to change.
