import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createNewQuireProjectTool, buildQuireProjectTool, previewQuireProjectTool, stopQuirePreviewTool } from '../commands/index.js';

const server = new McpServer({
    name: 'quire',
    version: '0.1.0',
});

function registerTools(): void {
    server.registerTool(
        createNewQuireProjectTool.name,
        createNewQuireProjectTool.config,
        createNewQuireProjectTool.handler
    );
    server.registerTool(
        buildQuireProjectTool.name,
        buildQuireProjectTool.config,
        buildQuireProjectTool.handler
    );
    server.registerTool(
        previewQuireProjectTool.name,
        previewQuireProjectTool.config,
        previewQuireProjectTool.handler
    );
    server.registerTool(
        stopQuirePreviewTool.name,
        stopQuirePreviewTool.config,
        stopQuirePreviewTool.handler
    );
}

registerTools();

export { server };