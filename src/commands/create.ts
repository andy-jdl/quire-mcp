import { exec } from 'child_process';
import { homedir } from 'os';
import { join, resolve as resolvePath } from 'path';
import { z } from 'zod';

export var lastCreatedProjectPath: string | null = null;
export const setLastCreatedProjectPath = (path: string) => {
    lastCreatedProjectPath = path;
}

const createNewQuireProject = async (projectName: string, folder: string = '.', starterTemplate?: string) => {
    const resolvedFolder = folder === '.' ? process.cwd() : resolvePath(homedir(), folder);
    const projectPath = join(resolvedFolder, projectName);
    const starter = starterTemplate ? ` ${starterTemplate}` : '';
    const command = `quire new "${projectPath}"${starter}`;

    return new Promise((resolve, reject) => {
        exec(command, { cwd: resolvedFolder, timeout: 60000 }, (error) => {
            if (error) {
                reject(`Error creating project: ${error.message}`);
                return;
            }
            setLastCreatedProjectPath(projectPath);
            resolve(`Successfully created project "${projectName}" in "${resolvedFolder}"`);
        });
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
            const name = projectName.replace(/\s+/g, '-');
            await createNewQuireProject(name, folder, starterTemplate);
            return {
                content: [{ type: 'text' as const, text: `Successfully created quire project: ${name} in (${folder || process.cwd()})` }]
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