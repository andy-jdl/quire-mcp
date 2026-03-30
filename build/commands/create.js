import { exec } from 'child_process';
import { homedir } from 'os';
import { join, resolve as resolvePath } from 'path';
import { z } from 'zod';
const createNewQuireProject = async (projectName, folder = '.', starterTemplate) => {
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
            resolve(`Successfully created project "${projectName}" in "${resolvedFolder}"`);
        });
    });
};
export const createNewQuireProjectTool = {
    name: 'create_new_quire_project',
    config: {
        description: 'Create a new quire project',
        inputSchema: z.object({
            projectName: z.string().describe('The name of the new quire project'),
            folder: z.string().optional().describe('The folder where the project should be created (default is current directory)'),
            starterTemplate: z.string().optional().describe('The starter template to use for the new project.')
        })
    },
    handler: async ({ projectName, folder, starterTemplate }) => {
        try {
            const name = projectName.replace(/\s+/g, '-');
            await createNewQuireProject(name, folder, starterTemplate);
            return {
                content: [{ type: 'text', text: `Successfully created quire project: ${name}` }]
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                content: [{ type: 'text', text: `Failed to create project: ${errorMessage}` }],
                isError: true
            };
        }
    }
};
