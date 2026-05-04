# Quire MCP

## About Quire
[Quire](https://quire.getty.edu/) is an open source digital publishing tool developed by Getty for creating beautiful, scholarly publications in multiple formats such as web, print and e-book. Optimized for visual imagery and designed to be widely accessible.

## About Quire MCP
Quire MCP leverages the Model Context Protocol (MCP) to let you interact with Quire through natural language conversation, without needing to use the terminal directly.
For example, you can prompt claude to: 

"Create a new Quire project called my-catalogue in my Documents folder"

and Claude Desktop will handle the rest.

Note: Quire MCP is currently a work in progress. Phase 1 focuses on core CLI tooling. Contributions and feedback are welcome.

## Requirements 
- Node.js 18+
- npm
- quire CLI installed
- Claude Desktop

### Quire CLI 
- Visit the official Quire repository and follow the instructions for your operating system: 🔗[link](https://github.com/thegetty/quire/).
- Confirm Quire CLI is accessible: `quire --version`

### Claude Desktop
- Download the latest release from Claude: 🔗[link](https://claude.ai/download)

### Starting the MCP Server
Through your terminal or IDE of choice, navigate to path where this repo is cloned and run the following commands:
Build: `npm run build`
Run the server: `npm run`

### Configuring your local mcp server with Claude Desktop
You need to register the MCP server with Claude Desktop by editing its config file.

#### For MacOS/Linux
`~/Library/Application Support/Claude/claude_desktop_config.json`

#### For Windows
`C:\\Users\\YOUR_USERNAME\\AppData\\Roaming\\Claude\\claude_desktop_config.json`

**Note**: If the file does not exist, create it with the filename: `claude_desktop_config.json`

Add the following to the config file:

```
{
  ...
  "mcpServers": {
    "quire": {
      "command": "node",
      "args": ["/absolute/path/to/qr-mcp-server/build/index.js"],
      "env": {
        "PATH": "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
      }
    }
  }
  ...
}
```

##### Finding your PATH value
The `PATH` value tells Claude Desktop where to find npm and npx. It varies depending on how Node was installed on your system.

Run the following in your terminal to find the correct value:

MacOS/Linux
```
echo $PATH
```
Windows
```
echo %PATH%
```

Copy the output and replace the PATH value in the config above with your own.

##### Common PATH values by setup
| Setup | PATH to add |
| ----- | ----------- |
| Homebrew (macOS) | /opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin |
| nvm | ~/.nvm/versions/node/v20.x.x/bin:/usr/bin:/bin |
| Windows | C:\Program Files\nodejs |

Note: If you're unsure which applies to you, run `which npx` (macOS/Linux) or `where npx` (Windows) in your terminal. 

This returns the full path to the binary:

`e.g. /opt/homebrew/bin/npx`

Remove the `/npx` from the filename and insert the remaining path to your PATH config.

`e.g. /opt/homebrew/bin`

Replace `/absolute/path/to/quire-mcp/index.js` with the actual path on your machine. After saving and restarting Claude Desktop, you should see the 🔨 Icon in the chat interface including the Quire tools which are available.
