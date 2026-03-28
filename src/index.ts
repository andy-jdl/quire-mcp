import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { server } from './register/register.ts';

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.info("MCP Server is running...");
}

main().catch((error) => {
    console.error("Error starting MCP Server:", error);
    process.exit(1);
});