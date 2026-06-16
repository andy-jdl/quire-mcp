---
name: Quire Basics
description: Brief guide to editing your quire publication.
---

## Overview
Quire resolves content from the `content` directory to generate HTML pages using 11ty. This directory contains editable `.yml` and `.md` files that represent pages in your publication. Quire uses 11ty shortcodes to dynamically render content from the associated `.yml` parameters.

## Do
- Always confirm with the user before editing their files.
- Ensure you are editing the appropriate YAML file for publication configurations and markdown file for resolved content.
- If the user is reporting broken content, verify that content resolves correctly from the sources provided within the project directory.

## Don't
- Do not make edits without confirming with the user.
- Do not invent fields in configuration files. Use existing entries or directory-level understanding as reference.
- Do not touch `_computed`, `config.yml`, or `.eleventy.js` unless explicitly asked.

## Content Directory Structure
- `/_data` — YAML configuration files for structuring your publication.
- `/_assets` — Stylistic configurations and images referenced by `_data` files.
- `/_computed` — Contains `eleventyComputed.js` for derived template values. Do not edit unless explicitly asked.
- `/catalogue` — Markdown files that resolve content from `objects.yaml`.
- `./` — Root-level markdown files used to generate 11ty HTML pages using HTML and shortcodes.

## Custom Content
Changes can be made to `custom.js` and `custom.css` to add extra functionality or styling to your publication.

### Config
`config.yml` serves as an abstraction layer for 11ty's Configuration API. Edits here may affect output directory, shortcode styling, and other build behaviors.

Do: If a user wants to change how a shortcode behaves, suggest editing `content/_data`. Always confirm before executing. Restart the server and ask the user to verify changes.

---

### Figures
`figures.yml` resolves images, audio, video, and tables.
- Images live under `content/images`.
- Audio and video require a `media_id` and `media_type` to resolve via external APIs. The `media_id` can be found in the URL of the hosted media.

**Do: Before adding a figure, ask the user which type it is: image, image with variants, video, or audio. Use the matching definition below.**

#### Image
| Property | Type Expected |
|----------|---------------|
| `id` | `string` |
| `src` | `string` (file path) |
| `caption` | `string` (markdown supported) |
| `credit` | `string` |
| `alt` | `string` |

#### Image with Variants
| Property | Type Expected |
|----------|---------------|
| `id` | `string` |
| `label` | `string` |
| `caption` | `string` (markdown supported) |
| `credit` | `string` |
| `annotations` | `array` |
| `annotations[].input` | `string` (enum: `radio`) |
| `annotations[].items` | `array` |
| `annotations[].items[].src` | `string` (file path) |
| `annotations[].items[].label` | `string` |

#### Video
| Property | Type Expected |
|----------|---------------|
| `id` | `string` |
| `poster` | `string` (file path) |
| `media_id` | `string` |
| `media_type` | `string` (enum: `youtube`) |
| `label` | `string` |
| `caption` | `string` |
| `credit` | `string` |
| `alt` | `string` |

#### Audio
| Property | Type Expected |
|----------|---------------|
| `id` | `string` |
| `media_id` | `string` |
| `media_type` | `string` (enum: `soundcloud`) |
| `label` | `string` |
| `caption` | `string` (markdown and URLs supported) |

---

### Objects
`objects.yaml` populates collection catalogue pages. Object entries may include images, metadata, and essay content.

Each new entry must go under the `object_list` field. The display order of metadata fields (the tombstone) is configured via `object_display_order` in `objects.yaml`.

| Property | Type Expected |
|----------|---------------|
| `id` | `string` |
| `title` | `string` (markdown supported) |
| `artist` | `string` |
| `year` | `integer` |
| `medium` | `string` |
| `dimensions` | `string` (HTML supported) |
| `location` | `string` |
| `link` | `string` (URL) |
| `figure` | `array` |
| `figure[].id` | `string` (reference to a figure `id` in figures.yml) |

---

### Publication
`publication.yaml` contains publication-level metadata. A user would edit this when preparing to publish, crediting contributors, or adding licensing and resource information.

---

### References
`references.yaml` contains cited works. A user would edit this when they want to reference external works within their publication.

| Property | Type Expected |
|----------|---------------|
| `id` | `string` |
| `full` | `string` (markdown supported) |

---

## Editing Markdown Content
Markdown files generate structured HTML pages using a blend of Liquid templating and shortcodes. All markdown files must include a frontmatter block at the top to render correctly.

**Example:**
```yaml
---
title: American Photographs
layout: essay
order: 30
---
```

### Core Frontmatter Properties
| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Title of the HTML page |
| `layout` | `string` (enum) | Liquid template used to render the page |
| `order` | `integer` | Position in publication navigation. Defaults to alphabetical if omitted. |

**Available `layout` values:**
`page` (default), `essay`, `entry`, `cover`, `table-of-contents`, `bibliography`, `splash`, `objects-page`

### Additional Frontmatter Properties
| Property | Type | Description |
|----------|------|-------------|
| `presentation` | `string` (enum) | `toc`: `list` (default), `brief`, `abstract`, `grid` — `entry`: `landscape` (default), `side-by-side` |
| `outputs` | `array` | Formats to include: `epub`, `pdf`, `html` |
| `toc` | `boolean` | Whether page appears in the publication Table of Contents |
| `menu` | `boolean` | Whether page appears in the publication menu |

Always ask the user for clarification when editing markdown files. If the task is unclear, request an example markdown file from the user before proceeding.

Quire publications support sub-sections by nesting related markdown files inside a subdirectory within the `content` directory.

---

## Shortcodes
Shortcodes dynamically render components using content from YAML files.

**Figure shortcode** — resolves a figure from `figures.yml` by `id`:
{% figure 'vid-1' %}

**Cite shortcode** — resolves a reference from `references.yaml` by `id`:
{% cite 'Evans 1938' %}

Available shortcodes can be found in the `_plugins` directory. New shortcodes must be registered in `.eleventy.js`.