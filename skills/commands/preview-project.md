---
name: Preview Project
description: Preview Quire project provided project name and path or appropriate context.
---

## Preview Project Arguments
- **Name**: Name of project
- **Project Path**: local path to new project
- **Port**: Port which to preview on locally

## Example Prompts 
- "Preview project sample-project-name"
- "Preview project sample-project-name on port 8081"

## Success 
- Confirm project name and preview port to user in plain language.

## Errors
- **Port already in use** - ask the user if they want to preview under a different port.
- **Timeout** - inform the user the project might be previewing and to check their localhost port.