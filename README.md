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

## Files

- `manifest.json`: tells Obsidian this is a plugin
- `main.js`: plugin logic
- `styles.css`: chip styling
- `versions.json`: version compatibility for Obsidian releases

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

## Publish On GitHub

1. Create a GitHub account at [github.com](https://github.com/) if you do not already have one.
2. Click `New repository`.
3. Name it something like `obsidian-hex-color-chips`.
4. Choose `Public` if you want other people to find and use it.
5. Click `Create repository`.
6. Use GitHub's `Add file -> Upload files` button to upload the files from this project.
7. Replace `Your Name` in `manifest.json` with your real name or preferred creator name.
8. Add your repository URL to `authorUrl` in `manifest.json` if you want.

## Create A GitHub Release Later

When you are ready to share install files, create a GitHub Release and upload:

- `manifest.json`
- `main.js`
- `styles.css`
- `versions.json`

That is the normal package shape Obsidian expects for a community plugin release.

## Submit To The Obsidian Community Plugin Directory

If you later want other Obsidian users to install it from inside the app, follow the official submission docs:

- [Build a plugin](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
- [Release your plugin](https://docs.obsidian.md/Plugins/Releasing/Release+your+plugin)
- [Submit your plugin](https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin)

## Notes

- This is an MVP, so the best-supported experience is Reading view.
- In Live Preview, the line you are actively editing stays as raw text so the hex value remains easy to change.
- If you want, the next improvement can be a settings tab for size, border radius, and whether normal tags should be ignored entirely.
