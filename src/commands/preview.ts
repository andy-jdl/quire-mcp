import { z } from 'zod';
import { platform } from 'os';
import { ChildProcess, exec, spawn } from 'child_process';
import { resolveProjectPath } from '../util/resolve.js';

export var previewProcess: ReturnType<typeof exec> | null = null;

const previewQuireProject = (projectPath: string): ChildProcess => {
    const isWindows = platform() === 'win32'; 
    const shell = isWindows ? 'cmd.exe' : '/bin/sh';

    if(previewProcess && !previewProcess.killed) {
       try { previewProcess.kill(); } catch (error) { /* Intentionally blank. */ }
    }

    const command = `npx quire preview`;
    const child = spawn(command, { cwd: projectPath, shell, detached: !isWindows, stdio: 'ignore' });

    if(!isWindows) child.unref();

    previewProcess = child;
    return child;
};

export const previewQuireProjectTool = {
    name: 'preview_quire_project' as const,
    config: {
        description: 'Runs the Preview command to generate the html site files and start a local server. Typically port 8080.',
        inputSchema: z.object({
            projectName: z.string().optional().describe('The name of the quire projec to preview. Combined with projectPaht treated as the parent folder.'),
            projectPath: z.string().optional().describe('The path to the quire project directory or when combined with projectName, the parent directory containing the project.')
        })
    },
    handler: async ({projectName, projectPath}: {projectName?: string; projectPath?: string}) => {
        try {
            const resolvedProjectPath = resolveProjectPath(projectPath, projectName);
            const child = previewQuireProject(resolvedProjectPath);
            return { 
                content: [{ type: 'text' as const, text: `Successfully started preview for quire project at ${resolvedProjectPath} with PID ${child.pid} on localhost:8080` }]
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