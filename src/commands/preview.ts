import { z } from 'zod';
import { lastCreatedProjectPath } from './create.js';
import { resolve as resolvePath } from 'path';
import { homedir, platform } from 'os';
import { exec } from 'child_process';

export var previewProcess: ReturnType<typeof exec> | null = null;

const previewQuireProject = (projectPath: string) => { 
    const command = `npx quire preview`;
    const shell = platform() === 'win32' ? 'cmd.exe' : '/bin/sh';
    previewProcess = exec(command, { cwd: projectPath, shell });
};

export const previewQuireProjectTool = {
    name: 'preview_quire_project' as const,
    config: {
        description: 'Runs the Preview command to generate the html site files and start a local server',
        inputSchema: z.object({
            projectName: z.string().optional().describe('The name of the quire project to preview')
        })
    },
    handler: async ({projectName}: {projectName?: string}) => {
        try {
            const projectPath = projectName ? resolvePath(homedir(), projectName) : lastCreatedProjectPath
            previewQuireProject(projectPath!);
            return { 
                content: [{ type: 'text' as const, text: `Successfully started preview for quire project: ${projectName}` }]
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                content: [{ type: 'text' as const, text: `Failed to preview project: ${errorMessage}` }],
                isError: true
            }
        }
    }
};