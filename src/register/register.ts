import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createNewQuireProjectTool } from '../commands/create.js';

const server = new McpServer({
    name: 'quire',
    version: '0.1.0',
});

function registerRoutes(): void {
    server.registerTool(
        createNewQuireProjectTool.name,
        createNewQuireProjectTool.config,
        createNewQuireProjectTool.handler
    );
}

registerRoutes();

export { server };