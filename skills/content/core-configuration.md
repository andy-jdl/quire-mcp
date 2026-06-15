---
name: Quire Basics
description: Brief guide to editing your quire publication.
---

## Overview
Quire resolves content from the `content` diretory to generate html pages using 11ty. This directory contains editable `.yml` and `.md` files to represent a page in your publication. Quire uses 11ty shortcodes to dynamically render content from the associated `.yml` parameters.  

## Do
- Always confirm with before editing their files.
- Ensure you are editing the appropriate yaml file for publication configurations and markdown file for resolved content.
- If the user is expressing broken content, ensure resolved content at the sources provided within the project directory.

## Don't 
- Do not make edits without confirming with the user.
- Do not invent fields to configuration files. Use exisitng examples or directory level understanding.

## Content Directory Structure
`/_data` - files for configuring the structure of your publication can be found under.
`/_assets` - This directory includes stylistic configurations and images used to resolve under `_data`
`_computed` - This file includes an `eleventyComputed.js` file for TODO
`catalogue` - This directory includes markdown files that resovle content from objects.yaml
`./` - Within root content directory, there are markdown files that used to generate 11ty html pages. This files use basic HTML and 11ty shortcodes to create publication pages.

## Custom Content
Changes can be made to `custom.js` and `custom.css` to include extra functionality or styling to your publication.

### Config
Config.yml serves as an abstraction layer for 11ty's Configuration API. Editing entries here may involve changing ouput directory, different styling for registered shortcodes. 

Do: If a user would like to edit how a shortcode behaves, suggest to access the `content/_data` file and make minor edits there. Always confirm with the user before executing. Kill and restart the server and ask user to check changes.

### Figures

Figures.yml is used to resolve images/audio/video/tables. 
Images live under `content/images`. Audio and video need a media_id and media_type to resolve using external APIs. Media_IDs can be gathered from the url host site. 

Do: If a user would like to add a figure, clarify which kind of figure is to be added? 

##### Images
| Property | Type Expected |
|----------|---------------|
| `id` | `string` |
| `src` | `string` (file path) |
| `caption` | `string` (markdown supported) |
| `credit` | `string` |
| `alt` | `string` |

##### Image with variants
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

##### Video
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

##### Audio 
| Property | Type Expected |
|----------|---------------|
| `id` | `string` |
| `media_id` | `string` |
| `media_type` | `string` (enum: `soundcloud`) |
| `label` | `string` |
| `caption` | `string` (markdown and URLs supported) |

### Objects
Objects.yaml is used to populate Collection catalogues. Object pages may include images, data about it and essay analysis or text. To add objects to your publication, use the following definition.

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
| `figure[].id` | `string` (reference to figure id) |

A user can configure the order in which information is displayed (often called a tombstone) by adjusting the `object_display_order` field within Object.yaml.
Each new entry should go under the `objects_list` field

### Publication
This file contains configurable publication detail fields. A user would want to make edits to this page when they are ready to publish, have contributors to credit as well as any resources and licensing for their publication.

### References
This file contains references to edit. A user would want to edit this when they want to reference other works. 

| Property | Type Expected |
|----------|---------------|
| `id` | `string` |
| `full` | `string` (markdown supported) |

## Editing Markdown Content
Markdown are used to generate structured HTML pages. They may use a blend of liquid and shortcodes. All markdown files must have have the following `Page FrontMatter` to render correctly.

e.g.
---
label: I
title: American Photographs
subtitle: Evans in Middletown
layout: essay
order: 30
---

- title: Title of the html page
- layout: changes the structure of the page that corresponds to its `.liquid` file. 
- order: Order in which the content appears in. Defaults to alphabetical.

## Shortcodes
Short codes are used to render components dynamically with content. Here is an example of the figures shortcode for resolving images within a markdown file.

```
... whatever." ({% cite 'Evans 1938' %})

{% figure 'vid-1' %}

## Documenting American Life

Because his pictures had been issued by the agency with..
```

Quire requires new shortcodes to be registerd in eleventy configuration API.
