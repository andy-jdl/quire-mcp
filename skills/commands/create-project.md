---
name: Create Project
description: Create Quire project in provided or appropriate directory.
---

## Create Project Arguments
- **Name**: Name of project.
- **Project Path**: local path to new project
- **Starter**: Repository url or local path for a starter project/template

## Example Prompts
- "Creat a new Quire project called my catalogue in my Documents folder"
- "Start a new project called test-project"
- "Create a project using the starter template https://github.com/..."

## Success 
- Confirm the project name and location to user in plain langauge.

## Errors
- **Project already exists** - ask the user if they want to choose a different name or location.
- **Folder not found** - confirm folder path.
- **Timeout** - inform the user the project may still be creating and to check project location.