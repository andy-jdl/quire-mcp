import { lastCreatedProjectPath } from "../commands/create.js";
import { homedir } from "os";
import { existsSync } from "fs";
import { join, normalize, resolve } from "path";

// Restrict allowed root to the user's Documents directory and set the default
// projects directory under Documents to avoid creating projects at the home root.
const DOCUMENTS_DIR = join(homedir(), 'Documents');
const ALLOWED_ROOT = resolve(DOCUMENTS_DIR);
const DEFAULT_PROJECTS_DIR = join(DOCUMENTS_DIR, 'quire-projects');

const assertSafePath = (resolvedPath: string): string => {
  const normalized = normalize(resolvedPath);
  if (!normalized.startsWith(ALLOWED_ROOT)) {
    throw new Error(`Path outside allowed directory: ${normalized}`);
  }
  return normalized;
};

export const resolveProjectPath = (projectPath?: string, projectName?: string): string => {
  let resolved: string;

  if (projectPath && projectName) {
    resolved = resolve(homedir(), projectPath, projectName);
  } else if (projectPath) {
    resolved = resolve(homedir(), projectPath);
  } else if (lastCreatedProjectPath) {
    resolved = resolve(lastCreatedProjectPath);
  } else if (projectName) {
    const inProjects = join(DEFAULT_PROJECTS_DIR, projectName);
    if (existsSync(inProjects)) return assertSafePath(inProjects);
    resolved = join(homedir(), projectName);
  } else {
    resolved = DEFAULT_PROJECTS_DIR;
  }

  return assertSafePath(resolved);
};