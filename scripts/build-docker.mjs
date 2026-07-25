import { execSync } from "node:child_process";

execSync("next build --turbopack", {
	stdio: "inherit",
	env: {
		...process.env,
		DOCKER_BUILD: "1",
		NEXT_TELEMETRY_DISABLED: "1",
	},
});
