import { exec } from 'child_process';
import { z } from 'zod';
import { lastCreatedProjectPath } from './create.js';
import { join, resolve as resolvePath } from 'path';
import { homedir } from 'os';
import { existsSync } from 'fs';

const buildQuireProject = async (projectPath: string | undefined) => {
    if (!projectPath) {
        throw new Error('Project path is undefined or doesn\'t exist');
    }

    const nodeModulesExists = existsSync(join(projectPath, 'node_modules'));
    const command = nodeModulesExists ? `npx quire build` : `npm i && npx quire build`;

    return new Promise((resolve, reject) => {
        exec(command, { cwd: projectPath, timeout: 120000 }, (error) => {
            if (error) {
                reject(`Error building project: ${error.message}`);
                return;
            }

            const siteExists = existsSync(join(projectPath, '_site'));
            const epubExists = existsSync(join(projectPath, '_epub'));
            if (!siteExists && !epubExists) {
                reject('Build command completed but no _site or _epub folder was generated');
                return;
            }

            resolve(`Successfully built project in "${projectPath}"`);
        });
    });
};


// TODO - Add option for project path if referencing a different project?
export const buildQuireProjectTool = {
    name: 'build_quire_project' as const,
    config: {
        description: 'Runs the Build command to generate the html site files',
        inputSchema: z.object({
            projectName: z.string().optional().describe('The name of the quire project to build')
        })
    },
    handler: async ({projectName}: {projectName?: string}) => {
        try {
            const projectPath = projectName ? resolvePath(homedir(), projectName) : lastCreatedProjectPath
            await buildQuireProject(projectPath!);
            return {
                content: [{ type: 'text' as const, text: `Successfully built quire project: ${projectName}` }]
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                content: [{ type: 'text' as const, text: `Failed to build project: ${errorMessage}` }],
                isError: true
            }
        }
    }
};
