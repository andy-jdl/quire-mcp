import { previewProcess } from "./preview.js"
import { platform } from 'os';
import { execFileSync } from "child_process";

const resolvePidsToKill = (): number[] => {
    const isWindows = platform() === 'win32';
    try { 
        let output: string;
        if (isWindows) {
            const netstatOutput = execFileSync('netstat', ['-ano'], { shell: false }).toString().trim();
            output = netstatOutput.split('\n').filter(line => line.includes(':8080') && line.includes('LISTEN')).join('\n');
        } else {
            output = execFileSync('lsof', ['-ti', 'tcp:8080', '-sTCP:LISTEN'], { shell: false }).toString().trim();
        }
        return output ? output.split('\n').map(Number).filter(pid => !isNaN(pid)) : [];
    } catch(error) {
        return [];
    }

}

// Defend against provided port numbers. Handling 8080 for now.
export const stopQuirePreviewTool = {
    name: 'stop_quire_preview' as const,
    config: {
        description: 'Stops the currently running quire preview process, if any.'
    },
    handler: async () => {
       
        try { 

            if(previewProcess && !previewProcess.killed) {
                try { previewProcess.kill(); } catch (error) { /* Intentionally blank. */ }
            }

            const pids = resolvePidsToKill();

            for(const pid of pids) {
                try { process.kill(pid); } catch (error) { /* Intentionally blank. */ }
            }

            return {
                content: [{ type: 'text' as const, text: 'Successfully stopped quire preview process.' }]
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                content: [{ type: 'text' as const, text: `Failed to stop quire preview process: ${errorMessage}` }],
                isError: true
            }
        }
       }
    }