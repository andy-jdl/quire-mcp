import { exec } from 'child_process';
import { z } from 'zod';
import { join } from 'path';
import { platform } from 'os';
import { existsSync } from 'fs';
import { resolveProjectPath } from '../util/resolve.js';

const buildQuireProject = async (projectPath: string) => {
    if (!existsSync(projectPath)) {
        throw new Error(`Project path does not exist: ${projectPath}`);
    }
    
    const nodeModulesExists = existsSync(join(projectPath, 'node_modules'));
    const command = nodeModulesExists ? `npx quire build` : `npm i && npx quire build`;
    const shell = platform() === 'win32' ? 'cmd.exe' : '/bin/sh';
    

    return new Promise((res, rej) => {
        exec(command, { cwd: projectPath, timeout: 120000, shell }, (error) => {
            if (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                rej(errorMessage);
                return;
            }

            const siteExists = existsSync(join(projectPath, '_site'));
            const epubExists = existsSync(join(projectPath, '_epub'));
            if (!siteExists && !epubExists) {
                throw new Error(`Build completed but no output found in "${projectPath}". Expected "_site" or "_epub" directory.`);
            }

            res(`Successfully built project in "${projectPath}"`);
        });
    });
};

export const buildQuireProjectTool = {
    name: 'build_quire_project' as const,
    config: {
        description: 'Runs the Build command to generate the html site files',
        inputSchema: z.object({
            projectName: z.string().optional().describe('The name of the quire project to build. Combined with projectPath treated as the parent folder. Projectname as they project directory. '),
            projectPath: z.string().optional().describe('The path to the quire project directory or when combined with projectName, the parent directory containing the project. ')
        })
    },
    handler: async ({projectName, projectPath}: {projectName?: string; projectPath?: string}) => {
        try {
            const resolvedProjectPath = resolveProjectPath(projectPath, projectName);
            await buildQuireProject(resolvedProjectPath);
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
