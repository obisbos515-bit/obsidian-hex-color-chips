# Hex Color Chips

Render hex color codes in Obsidian as inline color chips instead of plain text tags.

## Features

- Renders hex values such as `#0A2E5C` as visual chips in Reading view.
  - `#FFF`
  - `#FFFF`
  - `#0A2E5C`
  - `#0A2E5CCC`

## Installation

This plugin is currently intended for manual installation.

1. Open your vault's plugins folder: `.obsidian/plugins/`
2. Create a folder named `hex-color-chips`
3. Copy these files into it:
   - `manifest.json`
   - `main.js`
   - `styles.css`
   - `versions.json`
4. In Obsidian, open `Settings -> Community plugins`
5. Reload plugins if needed, then enable `Hex Color Chips`

## Usage

Write a hex color code directly in your note, for example:

```md
#0A2E5C
```

The plugin will render the value as a color chip where supported.

## Notes

- Reading view currently provides the most reliable experience.
- In Live Preview, the line you are actively editing remains raw text to keep the value easy to edit.
- Raw hex values are still interpreted by Obsidian as tags.

## Project

- `manifest.json`: Obsidian plugin manifest
- `main.js`: plugin logic
- `styles.css`: chip styling
- `versions.json`: version compatibility map

## License

[MIT](./LICENSE)
