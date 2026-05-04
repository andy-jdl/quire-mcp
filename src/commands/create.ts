import { execFile } from 'child_process';
import { isWindowsPlatform } from '../util/resolvePlatform.js';
import { homedir } from 'os';
import { dirname, join, resolve as resolvePath } from 'path';
import { z } from 'zod';

export var lastCreatedProjectPath: string = "";
export const setLastCreatedProjectPath = (path: string) => {
    lastCreatedProjectPath = path;
}

const DEFAULT_PROJECTS_DIR = join(homedir(), 'quire-projects');

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
        execFile(binaryCommand, args, {cwd: dirname(resolvedFolder), shell:false}, (error) => {
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
            folder: z.string().optional().describe('The folder where the project should be created (default is current directory)'),
            starterTemplate: z.string().optional().describe('The starter template to use for the new project.')
        })
    },
    handler: async ({ projectName, folder, starterTemplate }: { projectName: string, folder?: string, starterTemplate?: string }) => {
        try {
            const resolvedFolder = folder ? resolvePath(homedir(), folder) : DEFAULT_PROJECTS_DIR;            
            const projectPath = join(resolvedFolder, projectName);

            const args = ['quire', 'new', projectName];
            if(starterTemplate) args.push(starterTemplate);

            await createNewQuireProject(resolvedFolder ,projectPath, args);
            return {
                content: [{ type: 'text' as const, text: `Successfully created quire project: ${projectName} in ${resolvedFolder}` }]
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