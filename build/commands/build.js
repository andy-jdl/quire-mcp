import { exec } from 'child_process';
import { z } from 'zod';
import { lastCreatedProjectPath } from './create.js';
import { resolve as resolvePath } from 'path';
import { homedir } from 'os';
// TODO ensure build folders were generated
const buildQuireProject = async (projectPath) => {
    const nodeModulesExists = projectPath ? resolvePath(projectPath, 'node_modules') : false;
    const command = nodeModulesExists ? `npx quire build` : `npm i && npx quire build`;
    return new Promise((resolve, reject) => {
        exec(command, { cwd: projectPath, timeout: 60000 }, (error) => {
            if (error) {
                reject(`Error building project: ${error.message}`);
                return;
            }
            if (!projectPath) {
                reject('Project path is undefined or doesn\'t exist');
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
            const projectPath = projectName ? resolvePath(homedir(), projectName) : lastCreatedProjectPath;
            await buildQuireProject(projectPath);
            return {
                content: [{ type: 'text', text: `Successfully built quire project: ${projectName}` }]
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                content: [{ type: 'text', text: `Failed to build project: ${errorMessage}` }],
                isError: true
            };
        }
    }
};
