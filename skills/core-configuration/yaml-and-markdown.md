# YAML & Markdown
### Abstract: Understanding the basics of plain-text format

## Overview
Content is stores in two different plain-text formats: YAML for data and Markdown for narrative of textual content. This file goes over some basics and additional text formats Quire supports.

### Footnotes
Precede footnote numbers with an up-arrow accent `^`  (e.g.)

[^1]: The footnote itself is the same thing as the footnote..


### Markdown Output configuration in Quire
Configure appearance and controls for breaks, HTML tags, quotes and more under `_plugins/markdown/defaults.js`

### Markdown and HTML
Quire can use HTML tags in a Markdown file and conveniently add HTML elements that Markdown doesn’t support or for applying special styling.

### Fractions, Superscripts and SubScripts
Quire does not have a built in processor for super/sub script support. Users will need to use the HTML tags <sup> and <sup> to achieve this in their content format.

### Converting Mircrosoft Word docx to Md
Don't: 
- Include images or media into word before conversion
- font color or highlighting styles before converting
- Save as a .doc

Quire recommends using `Pandoc` for converting your files. Refer user to `Pandoc` when converting Microsoft Word docx