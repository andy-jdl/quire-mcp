import { execFile } from 'child_process';
import { isWindowsPlatform } from '../util/resolvePlatform.js';
import { homedir } from 'os';
import { dirname, join, resolve as resolvePath } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { z } from 'zod';

export var lastCreatedProjectPath: string = "";
export const setLastCreatedProjectPath = (path: string) => {
    lastCreatedProjectPath = path;
}

const DEFAULT_PROJECTS_DIR = join(homedir(), 'Documents', 'quire-projects');

/**
 * Normalizes project name: converts to lowercase, replaces spaces with dashes,
 * removes special characters, keeping only alphanumeric and dashes.
 */
const normalizeProjectName = (name: string): string => {
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/^-+|-+$/g, '');
};

/**
 * @param resolvedFolder // where to run `quire new projectName`
 * @param projectPath // stored after creation for reference
 * @param args // ['quire', 'new', projectName, ...optional starterTemplate]
 * @returns 
 */
const createNewQuireProject = async (
    resolvedFolder: string, 
    projectPath: string, 
    args: string[]
) => {
    const binaryCommand = isWindowsPlatform() ? 'npx.cmd' : 'npx';

    return new Promise((resolve, reject) => {
        execFile(binaryCommand, args, {cwd: resolvedFolder, shell:false}, (error) => {
            if(error){
                reject(error);
                return;
            } 
            try {
                setLastCreatedProjectPath(projectPath);
                resolve(`Successfully created new project: ${projectPath}`);
            } catch (err) {
                reject(err);
            }
        })
    });
};

export const createNewQuireProjectTool = {
    name: 'create_new_quire_project' as const,
    config: {
        description: 'Create a new Quire project in the current directory or specified folder',
        inputSchema: z.object({
            projectName: z.string().describe('The name of the new quire project'),
            folder: z.string().default(DEFAULT_PROJECTS_DIR).describe('The folder where the project should be created (defaults to the user\'s quire-projects directory)'),
            starterTemplate: z.string().optional().describe('The starter template to use for the new project.')
        })
    },
    handler: async ({ projectName, folder, starterTemplate }: { projectName: string, folder?: string, starterTemplate?: string }) => {
        try {
            const normalizedName = normalizeProjectName(projectName);
            
            if (!normalizedName) {
                return {
                    content: [{ type: 'text' as const, text: `Failed to create project: Project name must contain at least one valid character (alphanumeric or dash)` }],
                    isError: true
                };
            }

            const resolvedFolder = folder ? resolvePath(homedir(), folder) : DEFAULT_PROJECTS_DIR;            
            // Ensure the resolved folder exists so `execFile` can run with that cwd
            if (!existsSync(resolvedFolder)) {
                mkdirSync(resolvedFolder, { recursive: true });
            }
            const projectPath = join(resolvedFolder, normalizedName);

            const args = ['quire', 'new', normalizedName];
            if(starterTemplate) args.push(starterTemplate);

            await createNewQuireProject(resolvedFolder, projectPath, args);
            return {
                content: [{ type: 'text' as const, text: `Successfully created quire project: ${normalizedName} in ${resolvedFolder}` }]
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                content: [{ type: 'text' as const, text: `Failed to create project: ${errorMessage}` }],
                isError: true
            };
        }
    }
};