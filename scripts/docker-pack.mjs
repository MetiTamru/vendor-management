import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next/standalone/server.js");
const image = process.env.DOCKER_IMAGE ?? "starter-app:latest";

if (!existsSync(standalone)) {
	console.error(
		"[docker:pack] Missing .next/standalone — run pnpm build:docker first"
	);
	process.exit(1);
}

const args = [
	"build",
	"-f",
	"infra/Dockerfile",
	"-t",
	image,
	"--progress=plain",
	".",
];

console.log(`[docker:pack] docker ${args.join(" ")}`);
execSync(`docker ${args.map((a) => `"${a}"`).join(" ")}`, {
	stdio: "inherit",
	cwd: root,
	shell: true,
});
