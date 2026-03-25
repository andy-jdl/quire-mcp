import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { exec } from 'node:child_process';

const server = new McpServer({
    name: "quire",
    version: "0.1.0",
})

const createNewQuireProject = async (projectName: string, options: string[] = []) => {
    return new Promise((resolve, reject) => {
        const flags = options.join(' ')
        exec(`quire new ${projectName} ${flags}`.trim(), (error, stdout, stderr) => {
            if (error) {
                reject(`Error creating project "${projectName}": ${error.message}`)
                return
            }
            resolve(stdout ? stdout : stderr)
        })
    })
}

server.registerTool(
    "create_new_quire_project", 
    {
        description: "Create a new quire project",
        inputSchema: z.object({
            projectName: z.string().describe("The name of the new quire project")
        })
    },
    async ({ projectName }) => {
        try {
            const name = projectName.replace(/\s+/g, '-');
            await createNewQuireProject(name);
            return {
                content: [{ type: 'text', text: `Successfully created quire project: ${name}` }]
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                content: [{ type: 'text', text: `Failed to create project: ${errorMessage}` }],
                isError: true
            };
        }
    }
)

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP Server is running...");
}

main().catch((error) => {
    console.error("Error starting MCP Server:", error);
    process.exit(1);
});