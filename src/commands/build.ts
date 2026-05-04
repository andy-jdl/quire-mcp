import { execFile } from 'child_process';
import { z } from 'zod';
import { join } from 'path';
import { existsSync } from 'fs';
import { resolveProjectPath } from '../util/resolveProjectPath.js';
import { isWindowsPlatform } from '../util/resolvePlatform.js';

const nodeModulesExists = (projectPath: string): boolean =>
  existsSync(join(projectPath, 'node_modules'));

const runInstall = (cwd: string): Promise<void> => {
    const binary = isWindowsPlatform() ? 'npm.cmd' : 'npm'
    return new Promise((resolve, reject) => {
        execFile(binary, ['install'], { cwd, shell: false}, (error) => {
            if(error) { reject(error); return; }
            resolve();
        });
    });
};

const runBuild = (cwd: string): Promise<string> => {
    const binary = isWindowsPlatform() ? 'npx.cmd' : 'npx'
    return new Promise((resolve, reject) => {
        execFile(binary, ['quire', 'build'], { cwd, shell: false }, (error) => {
            if (error) { reject(error); return; }

            const siteExists = existsSync(join(cwd, '_site'));
            const epubExists = existsSync(join(cwd, '_epub'));
            if (!siteExists && !epubExists) {
                reject(new Error(`Build completed but no output found in "${cwd}". Expected "_site" or "_epub" directory.`));
                return;
            }

            resolve(`Successfully built project in "${cwd}"`);
        });
    })
}

const buildQuireProject = async (projectPath: string) => {
    if(!nodeModulesExists(projectPath)) {
        await runInstall(projectPath);
    }
    return await runBuild(projectPath);
};

export const buildQuireProjectTool = {
    name: 'build_quire_project' as const,
    config: {
        description: 'Runs the Build command to generate html site files',
        inputSchema: z.object({
            projectName: z.string().optional().describe('Name of the quire project to build. Combined with projectPath treated as the parent folder. Projectname as they project directory. '),
            projectPath: z.string().optional().describe('Path to the quire project directory or when combined with projectName, the parent directory containing the project. ')
        })
    },
    handler: async ({projectName, projectPath}: {projectName?: string; projectPath?: string}) => {
        try {
            const resolvedProject = resolveProjectPath(projectPath, projectName);

            const result = await buildQuireProject(resolvedProject);
            return {
                content: [{ type: 'text' as const, text: result }]
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
