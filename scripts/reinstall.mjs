import { execSync } from "node:child_process";
import { existsSync, renameSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const nodeModules = join(root, "node_modules");

if (existsSync(nodeModules)) {
	const backup = join(root, `node_modules.old.${Date.now()}`);
	console.log(`[reinstall] Moving ${nodeModules} -> ${backup}`);
	renameSync(nodeModules, backup);
	console.log(
		"[reinstall] Old folder kept as backup. Delete manually after install succeeds."
	);
}

console.log("[reinstall] Running pnpm install...");
execSync("pnpm install", { stdio: "inherit", cwd: root });
