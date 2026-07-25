import fs from "node:fs";
import path from "node:path";

const target = path.join(process.cwd(), ".next");

if (fs.existsSync(target)) {
	fs.rmSync(target, { recursive: true, force: true });
	console.log("Removed .next");
} else {
	console.log(".next not found (already clean)");
}
