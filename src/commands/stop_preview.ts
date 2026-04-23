import { previewProcess } from "./preview.js"

export const stopQuirePreviewTool = {
    name: 'stop_quire_preview' as const,
    config: {
        description: 'Stops the currently running quire preview process, if any.'
    },
    handler: async () => {
        if (previewProcess && !previewProcess.killed) {
            try {
                previewProcess.kill();
                return { content: [{ type: 'text' as const, text: 'Successfully stopped the quire preview process.' }] };
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                return { content: [{ type: 'text' as const, text: `Failed to stop the quire preview process: ${errorMessage}` }] };
            }
        } else {
            return { content: [{ type: 'text' as const, text: 'No quire preview process is currently running.' }] };
        }
    }
}