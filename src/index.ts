#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { server } from './register/register.js';

async function main() {
  const args = process.argv.slice(2);

  if (args[0] === 'install') {
    const { runInstaller } = await import('./install.js');
    await runInstaller();
    return;
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Server is running...');
}

main().catch((error) => {
  console.error('Error starting MCP Server:', error);
  process.exit(1);
});