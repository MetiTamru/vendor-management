import { existsSync } from "node:fs";
import { join } from "node:path";

const required = [
	"next/package.json",
	"react/package.json",
	"typescript/package.json",
	"picocolors/package.json",
	"prettier/package.json",
];

const missing = required.filter(
	(entry) => !existsSync(join(process.cwd(), "node_modules", entry))
);

if (missing.length > 0) {
	console.error(
		"[postinstall] Missing or broken dependencies:",
		missing.join(", ")
	);
	console.error("Run: pnpm reinstall");
	process.exit(1);
}
