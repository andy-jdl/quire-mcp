# Metadata & Configuration
## Abstract: Update crucial information during development

## Overview 
YAML files are used as the source of truth that contain metadata to define how the pulbication works. `config.yaml` and `publication.yaml` under `content/_data` allow for editing as described.

## Shortcodes
Shortcodes are used to dynamically render the publication with data from the `config` and `publication` files.

## Settings in config.yaml
Each configuration has some or all of the following:

Labels/Headers - Plain text
String characters - Directory or id or character
Integer - Numeric

### Common pitfalls 
Do

pdf:
    outputDir: '/_assets/downloads'

Don't

pdf:
    outputDir: /_assets/downloads

Try to keep the consistency between configurations and their types. Failure to do so will cause errors.

## Metadata in publication.yaml
This is the source of truth for the publication. Much of the properties within this file help support online publications with SEO and discovery.

### Publication URL
Default is set to localhost. When ready to publish, change this value to the appropriate host url. Ideally `https://`

### Title & Description
Title (required) and subtitle (optional) are the most important for SEO. Generally a good idea to include both `one_line` and `full` descriptions.

### Publication Details
The `pub_date` and `language` are both required. `pub_date` is in ISO 8601 format. `language` shoult be a 2-letter ISO 639-1 language code (default `en`).

The optional `pub_type` can have values:
`book`, `journal-periodical` or `other`. 

`book`: Recommended to include ISBN
`journal-periodical`: Recommended to include ISSN with `series_periodical_name` and `series_issue_number` if possible.

Quire supports multiple publishers but at least on `publisher` should be listed with their attributes.

### Contributors
`contributor` type: `primary` (shows up in Cover, Menu, Title Page), `secondary`, `project-team`

Additional fields about the contributors include: title, affiliation, bio, url, image

### Copyright & License
Include `copyright` for publication and `license` if distributing through an Open Access license.

### Formats, Resources & Links
These appear in the sidebar menu of the publication.

A publication can have multiple `resource_link` properties with the following types:

- `other-format`: List PDF, EPUB and paperback editions of the publications under the name attribute.

- `related-sources`: additional items for readers' reference

- `footer-link`: links at the bottom of the sidebar menu, used typically for About, Policies or social media profiles.

### Subjects
Multiple subjects can be added to the publication to aid search discovery.

Subject type: `keyword`, `bisac` or `getty`

`bisac` subject codes: Standard used for categorizing books based on topical content. 

`getty` vocabularies: Developed to ensure consistent cataloguing and more effecient retrieval of information

Identifier: Bisac types should include their BISAC code and Getty Vocabularies their semantic URL respectively.

### Revision History
Revision histories appear in the About Page section. Any number of revisions must include their `date` and `summary` attribute of changes made on that date. `summary` supports MD formatting and would be in list form.

If using Github, or similar, you may include the `repository_url` in this section. In this case, the history collected can act as an overview.

e.g.
```
subjects:
  - type: keyword
    name: French painting, 19th Century, Delacroix
```
