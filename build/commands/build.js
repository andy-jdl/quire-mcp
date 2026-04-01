import { exec } from 'child_process';
import { z } from 'zod';
import { lastCreatedProjectPath } from './create.js';
const buildQuireProject = async (projectPath) => {
    const command = `quire build`;
    return new Promise((resolve, reject) => {
        exec(command, { cwd: projectPath, timeout: 60000 }, (error) => {
            if (error) {
                reject(`Error building project: ${error.message}`);
                return;
            }
            resolve(`Successfully built project in "${projectPath}"`);
        });
    });
};
export const buildQuireProjectTool = {
    name: 'build_quire_project',
    config: {
        description: 'Runs the Build command to generate the html site files',
        inputSchema: z.object({
            projectName: z.string().optional().describe('The name of the quire project to build'),
        })
    },
    handler: async ({ projectName }) => {
        try {
            // TODO - path to project might not exist or have been created
            await buildQuireProject(lastCreatedProjectPath || undefined);
            return {
                content: [{ type: 'text', text: `Successfully built quire project: ${projectName}` }]
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Quire build error';
            return {
                content: [{ type: 'text', text: `Failed to build project: ${errorMessage}` }],
                isError: true
            };
        }
    }
};
