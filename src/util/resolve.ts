import { lastCreatedProjectPath } from "../commands/create.js";
import { homedir } from "os";
import { existsSync } from "fs";
import { resolve } from "path";

export const resolveProjectPath = (projectPath?: string, projectName?: string): string => {
    if(projectPath && projectName) {
        return resolve(projectPath, projectName);
    } else if(projectPath) {
        return resolve(projectPath);
    } else if(lastCreatedProjectPath) {
        return resolve(lastCreatedProjectPath);
    } else if(projectName) {
        const cwdPath = resolve(process.cwd(), projectName);
        if(existsSync(cwdPath)) {
            return cwdPath;
        }
        return resolve(homedir(), projectName);
    }
    return process.cwd();
}