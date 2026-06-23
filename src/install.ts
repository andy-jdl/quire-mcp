import { execFileSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname, normalize, resolve, sep } from 'path';
import { homedir, platform } from 'os';
import { createInterface } from 'readline';

const isWindowsPlatform = (): boolean => platform() === 'win32';

// --- Path Safety --------------------------------------------------------------

const getDocumentsDir = (): string => {
  const os = platform();
  if (os === 'win32') return join(process.env.USERPROFILE ?? homedir(), 'Documents');
  if (os === 'darwin') return join(homedir(), 'Documents');
  return join(homedir(), 'Documents'); // XDG doesn't have a standard, fallback
};

const ALLOWED_ROOT = resolve(getDocumentsDir()) + sep; // sep from 'path'

const assertSafePath = (resolvedPath: string): string => {
  const normalized = normalize(resolvedPath);
  if (!normalized.startsWith(ALLOWED_ROOT)) {
    throw new Error(`Path outside allowed directory: ${normalized}`);
  }
  return normalized;
};

// --- User Prompt --------------------------------------------------------------

const PROMPT_TIMEOUT_MS = 30_000;

const promptUser = (question: string): Promise<string> => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stderr
  });

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      rl.close();
      reject(new Error('Prompt timed out after 30 seconds. Use --non-interactive mode.'));
    }, PROMPT_TIMEOUT_MS);

    rl.question(question, (answer) => {
      clearTimeout(timer);
      rl.close();
      resolve(answer.trim());
    });
  });
};

// --- Config Path Resolution ---------------------------------------------------

const getConfigPath = (): string => {
  const os = platform();
  if (os === 'win32') {
    return join(process.env.APPDATA ?? '', 'Claude', 'claude_desktop_config.json');
  }
  if (os === 'darwin') {
    return join(homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  }
  // Linux
  return join(homedir(), '.config', 'Claude', 'claude_desktop_config.json');
};

// --- Quire CLI ----------------------------------------------------------------

// FIX 1: Use execFileSync with an args array instead of execSync with a shell
// string. execSync implicitly uses shell: true, which is inconsistent with the
// project's shell: false policy. The version check is low-risk, but aligning
// it removes an unnecessary shell invocation.
const isQuireInstalled = (): boolean => {
  const binary = isWindowsPlatform() ? 'quire.cmd' : 'quire';
  try {
    execFileSync(binary, ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

const installQuire = (): void => {
  const binary = isWindowsPlatform() ? 'npm.cmd' : 'npm';
  console.error('Installing @thegetty/quire-cli globally...');
  try {
    execFileSync(
      binary,
      ['install', '--global', '@thegetty/quire-cli'],
      { stdio: 'inherit' }
    );
    console.error('Quire CLI installed successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to install Quire CLI: ${message}`);
  }
};

// --- Claude Desktop Config ---------------------------------------------------

// FIX 3: Fail fast if PATH is unset at install time rather than writing an
// empty string into the config. An empty PATH would cause npm/npx lookups to
// fail silently at runtime with a confusing ENOENT, which is harder to debug
// than a clear error here.
const captureInstallerPath = (): string => {
  const path = process.env.PATH;
  if (!path) {
    throw new Error(
      'PATH environment variable is not set. ' +
      'Run the installer from a terminal where npm and npx are accessible.'
    );
  }
  return path;
};

// In getMcpEntry, don't capture PATH at install time at all
const getMcpEntry = (projectsDir: string) => ({
  command: 'quire-mcp',
  args: [],
  env: {
    QUIRE_PROJECTS_DIR: projectsDir
    // No PATH — Claude Desktop inherits the shell's PATH naturally
  }
});

const readConfig = (configPath: string): Record<string, any> => {
  if (!existsSync(configPath)) return { mcpServers: {} };

  const raw = readFileSync(configPath, 'utf-8');

  try {
    const parsed = JSON.parse(raw);
    if (!parsed.mcpServers) parsed.mcpServers = {};
    return parsed;
  } catch (err) {
    const backupPath = `${configPath}.bak-${Date.now()}`;
    writeFileSync(backupPath, raw, 'utf-8');
    throw new Error(
      `Existing config at ${configPath} is invalid JSON.\n` +
      `A backup has been saved to ${backupPath}.\n` +
      `Fix the file manually, then re-run the installer.`
    );
  }
};

const writeConfig = (configPath: string, config: Record<string, any>): void => {
  const configDir = dirname(configPath);
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
};

// --- Installer ---------------------------------------------------------------

export const runInstaller = async (): Promise<void> => {
  console.error('');
  console.error('Quire MCP Installer');
  console.error('--------------------');

  // FIX 3: Capture and validate PATH before doing anything else so the error
  // surfaces immediately rather than after the user has answered prompts.
  const envPath = captureInstallerPath();

  // Step 1 -- Quire CLI
  if (isQuireInstalled()) {
    console.error('Quire CLI already installed.');
  } else {
    console.error('Quire CLI not found.');
    installQuire();
  }

  // Step 2 -- Prompt for projects directory
  const defaultDir = join(homedir(), 'quire-projects');
  const answer = await promptUser(`\nWhere should Quire projects be stored? (default: ${defaultDir}): `);
  const rawProjectsDir = answer || defaultDir;

  // FIX 2 (noted as already correct): resolve() must expand the user-provided
  // path to absolute before assertSafePath runs its prefix check. Order is
  // preserved here intentionally.
  let projectsDir: string;
  try {
    projectsDir = assertSafePath(resolve(rawProjectsDir));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Invalid path: ${message}`);
    process.exit(1);
  }

  // Create the directory if it doesn't exist
  if (!existsSync(projectsDir)) {
    mkdirSync(projectsDir, { recursive: true });
    console.error(`Projects directory created: ${projectsDir}`);
  } else {
    console.error(`Projects directory already exists: ${projectsDir}`);
  }

  // Step 3 -- Write Claude Desktop config
  const configPath = getConfigPath();
  console.error(`\nConfiguring Claude Desktop...`);
  console.error(`Config path: ${configPath}`);

  const config = readConfig(configPath);

  // FIX 4: Replace the hard early-return with an update path. If a quire entry
  // already exists, prompt the user to confirm before overwriting rather than
  // silently bailing. This covers re-runs after changing the projects
  // directory. A --force flag would be the right long-term solution, but an
  // interactive confirmation is sufficient for 1.0.
  if (config.mcpServers.quire) {
    const existing = JSON.stringify(config.mcpServers.quire.env?.QUIRE_PROJECTS_DIR ?? '(unknown)');
    console.error(`\nQuire MCP is already configured (projects dir: ${existing}).`);
    const confirm = await promptUser('Overwrite with new settings? (y/N): ');
    if (confirm.toLowerCase() !== 'y') {
      console.error('Installation cancelled. Existing configuration unchanged.');
      console.error(`To edit manually, open: ${configPath}`);
      return;
    }
  }

  // Append/overwrite quire entry -- all other mcpServers entries are preserved
  config.mcpServers.quire = getMcpEntry(projectsDir);
  writeConfig(configPath, config);

  // Step 4 -- Done
  console.error('');
  console.error('Quire MCP installed successfully.');
  console.error(`Projects directory: ${projectsDir}`);
  console.error('');
  console.error('Restart Claude Desktop to finish.');
  console.error('');
};