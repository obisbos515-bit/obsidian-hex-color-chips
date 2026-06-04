const { Plugin } = require("obsidian");

const INLINE_HEX_PATTERN =
  /(?<![0-9A-Za-z/_-])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9A-Za-z_-])/g;
const STRICT_HEX_PATTERN =
  /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const EDITOR_DECORATION_CACHE = new Map();

module.exports = class HexColorChipsPlugin extends Plugin {
  onload() {
    this.registerMarkdownPostProcessor((element) => {
      replaceRenderedHexTags(element);
      replaceInlineHexText(element);
    });

    const editorExtension = createEditorExtension();

    if (editorExtension) {
      this.registerEditorExtension(editorExtension);
    }
  }
};

function replaceRenderedHexTags(container) {
  const tags = container.querySelectorAll("a.tag");

  for (const tag of tags) {
    const value = cleanHexValue(tag.textContent);

    if (!isHexColor(value)) {
      continue;
    }

    tag.replaceWith(createChipElement(container.ownerDocument, value, "preview"));
  }
}

function replaceInlineHexText(container) {
  const nodesToReplace = [];
  const doc = container.ownerDocument;
  const walker = doc.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const text = node.nodeValue;
        const parent = node.parentElement;

        if (!text || !parent || !containsInlineHex(text)) {
          return NodeFilter.FILTER_REJECT;
        }

        if (
          parent.closest(
            "a, code, pre, script, style, textarea, input, .hex-color-chip",
          )
        ) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );

  while (walker.nextNode()) {
    nodesToReplace.push(walker.currentNode);
  }

  for (const node of nodesToReplace) {
    const fragment = buildInlineFragment(doc, node.nodeValue);

    if (fragment) {
      node.replaceWith(fragment);
    }
  }
}

function buildInlineFragment(doc, text) {
  INLINE_HEX_PATTERN.lastIndex = 0;

  let match;
  let lastIndex = 0;
  const fragment = doc.createDocumentFragment();
  let didReplace = false;

  while ((match = INLINE_HEX_PATTERN.exec(text)) !== null) {
    const hex = match[0];
    const start = match.index;

    if (start > lastIndex) {
      fragment.append(text.slice(lastIndex, start));
    }

    fragment.append(createChipElement(doc, hex, "preview"));
    lastIndex = start + hex.length;
    didReplace = true;
  }

  if (!didReplace) {
    return null;
  }

  if (lastIndex < text.length) {
    fragment.append(text.slice(lastIndex));
  }

  return fragment;
}

function createChipElement(doc, hex, variant) {
  const chip = doc.createElement("span");

  chip.classList.add("hex-color-chip");
  chip.classList.add(
    variant === "editor" ? "hex-color-chip--editor" : "hex-color-chip--preview",
  );
  chip.textContent = hex;
  chip.setAttribute("aria-label", `Color ${hex}`);

  applyChipStyles(chip, hex);

  return chip;
}

function applyChipStyles(element, hex) {
  const background = normalizeHex(hex);
  const foreground = pickForegroundColor(background);
  const border = buildBorderColor(background);

  element.dataset.hexChip = background.toUpperCase();
  element.style.setProperty("--hex-chip-color", background);
  element.style.setProperty("--hex-chip-foreground", foreground);
  element.style.setProperty("--hex-chip-border", border);
}

function containsInlineHex(text) {
  return new RegExp(INLINE_HEX_PATTERN.source).test(text);
}

function isHexColor(value) {
  return STRICT_HEX_PATTERN.test(cleanHexValue(value));
}

function cleanHexValue(value) {
  return (value ?? "").trim();
}

function normalizeHex(hex) {
  const value = cleanHexValue(hex).replace("#", "");

  if (value.length === 3 || value.length === 4) {
    const expanded = value
      .split("")
      .map((char) => char + char)
      .join("");

    return `#${expanded}`;
  }

  return `#${value}`;
}

function buildBorderColor(hex) {
  const { r, g, b } = hexToRgb(hex);

  return `rgba(${r}, ${g}, ${b}, 0.45)`;
}

function buildStyleAttribute(hex) {
  const background = normalizeHex(hex);
  const foreground = pickForegroundColor(background);
  const border = buildBorderColor(background);

  return [
    `--hex-chip-color: ${background}`,
    `--hex-chip-foreground: ${foreground}`,
    `--hex-chip-border: ${border}`,
  ].join("; ");
}

function pickForegroundColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.62 ? "#111827" : "#f8fafc";
}

function hexToRgb(hex) {
  const normalized = normalizeHex(hex).slice(1);
  const rgb = normalized.slice(0, 6);

  return {
    r: Number.parseInt(rgb.slice(0, 2), 16),
    g: Number.parseInt(rgb.slice(2, 4), 16),
    b: Number.parseInt(rgb.slice(4, 6), 16),
  };
}

function createEditorExtension() {
  let Decoration;
  let ViewPlugin;
  let RangeSetBuilder;
  let WidgetType;

  try {
    ({ Decoration, ViewPlugin, WidgetType } = require("@codemirror/view"));
    ({ RangeSetBuilder } = require("@codemirror/state"));
  } catch (error) {
    console.error("[hex-color-chips] Failed to load CodeMirror APIs.", error);
    return null;
  }

  class HexColorChipWidget extends WidgetType {
    constructor(hex) {
      super();
      this.hex = cleanHexValue(hex).toUpperCase();
    }

    eq(other) {
      return other.hex === this.hex;
    }

    toDOM() {
      const chip = document.createElement("span");

      chip.className = "hex-color-chip hex-color-chip--editor";
      chip.textContent = this.hex;
      chip.setAttribute("aria-label", `Color ${this.hex}`);
      chip.setAttribute("data-hex-chip", this.hex);
      chip.setAttribute("style", buildStyleAttribute(this.hex));

      return chip;
    }

    ignoreEvent() {
      return false;
    }
  }

  return ViewPlugin.fromClass(
    class HexColorChipEditorPlugin {
      constructor(view) {
        this.decorations = buildEditorDecorations(
          view,
          Decoration,
          RangeSetBuilder,
          HexColorChipWidget,
        );
      }

      update(update) {
        if (update.docChanged || update.viewportChanged || update.selectionSet) {
          this.decorations = buildEditorDecorations(
            update.view,
            Decoration,
            RangeSetBuilder,
            HexColorChipWidget,
          );
        }
      }
    },
    {
      decorations: (plugin) => plugin.decorations,
    },
  );
}

function buildEditorDecorations(view, Decoration, RangeSetBuilder, HexColorChipWidget) {
  const builder = new RangeSetBuilder();
  const selectedLines = getSelectedLineNumbers(view);

  for (const { from, to } of view.visibleRanges) {
    const text = view.state.doc.sliceString(from, to);
    INLINE_HEX_PATTERN.lastIndex = 0;

    let match;
    while ((match = INLINE_HEX_PATTERN.exec(text)) !== null) {
      const hex = match[0];
      const start = from + match.index;
      const end = start + hex.length;

      if (selectedLines.has(view.state.doc.lineAt(start).number)) {
        continue;
      }

      builder.add(
        start,
        end,
        getEditorDecoration(Decoration, HexColorChipWidget, hex),
      );
    }
  }

  return builder.finish();
}

function getEditorDecoration(Decoration, HexColorChipWidget, hex) {
  const normalized = cleanHexValue(hex).toUpperCase();
  const cached = EDITOR_DECORATION_CACHE.get(normalized);

  if (cached) {
    return cached;
  }

  const decoration = Decoration.replace({
    inclusive: false,
    widget: new HexColorChipWidget(normalized),
  });

  EDITOR_DECORATION_CACHE.set(normalized, decoration);

  return decoration;
}

function getSelectedLineNumbers(view) {
  const lines = new Set();

  for (const range of view.state.selection.ranges) {
    const startLine = view.state.doc.lineAt(range.from).number;
    const endLine = view.state.doc.lineAt(range.to).number;

    for (let lineNumber = startLine; lineNumber <= endLine; lineNumber += 1) {
      lines.add(lineNumber);
    }
  }

  return lines;
}
