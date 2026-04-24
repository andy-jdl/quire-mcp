import { z } from 'zod';
import { platform } from 'os';
import { resolveProjectPath } from '../util/resolve.js';
import { exec } from 'child_process';
import { existsSync,readdirSync } from 'fs';
import { resolve } from 'path';

const resolvePathsDidClean = (projectPath: string): boolean =>{
    if(existsSync(resolve(projectPath, '.11ty-vite'))) {
        return false;
    }
    const files = readdirSync(projectPath);
    if(files.some(f => f.includes('.epub'))) {
        return false;
    }
    if(files.some(f => f.includes('.pdf'))) {
        return false;
    }

    return true;
}

const cleanQuireProject = async (projectPath: string) => {
    const command = `npx quire clean`;
    const shell = platform() === 'win32' ? 'cmd.exe' : '/bin/sh';
    return new Promise((res, rej) => {
        exec(command, { cwd: projectPath, timeout: 120000, shell }, (error) => {
            if (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                rej(errorMessage);
                return;
            }
            
            if(!resolvePathsDidClean(projectPath)) {
                rej(`Failed to resolve project path for cleaning: "${projectPath}"`);
                return;
            }

            res(`Successfully cleaned project in "${projectPath}"`);
        });
    })
}

export const cleanQuireProjectTool = {
    name: 'clean_quire_project' as const,
    config: {
        description: 'Cleans the quire project by removing old build artifacts',
        inputSchema: z.object({
            projectName: z.string().optional().describe('The name of the quire project to clean. Combined with projectPath treated as the parent folder. Projectname as they project directory. '),
            projectPath: z.string().optional().describe('The path to the quire project directory or when combined with projectName, the parent directory containing the project. ')
        })
    },
    handler: async ({projectName, projectPath}: {projectName?: string; projectPath?: string}) => {
        try{ 
            const resolvedProjectPath = resolveProjectPath(projectPath, projectName);
            await cleanQuireProject(resolvedProjectPath);
            return {
                content: [{ type: 'text' as const, text: `Successfully cleaned quire project: ${projectName}` }]
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                content: [{ type: 'text' as const, text: `Failed to clean project: ${errorMessage}` }],
                isError: true
            }
        }

    }
}