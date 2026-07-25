import { logger } from "@/lib/logger";

const REQUIRED_ENV_VARS = [
	"NEXT_PUBLIC_URL",
	"NEXT_PUBLIC_API_URL",
	"NEXT_PUBLIC_GA_ID",
	"NEXT_PUBLIC_GOOGLE_VERIFICATION",
	// Add other required env variables here
];

export function checkRequiredEnvVars() {
	const missingEnvVars = REQUIRED_ENV_VARS.filter(
		(envVar) => !process.env[envVar]
	);

	if (missingEnvVars.length > 0) {
		logger.warn(
			`⚠️ Missing required environment variables:\n${missingEnvVars
				.map((envVar) => `- ${envVar}`)
				.join(
					"\n"
				)}\n\nPlease create a .env file in the root directory with these variables.`
		);

		console.warn(`
╔════════════════════════════════════════════════════════════════╗
║                    Missing Environment Variables               ║
╠════════════════════════════════════════════════════════════════╣
${missingEnvVars.map((envVar) => `║  • ${envVar.padEnd(52)} ║`).join("\n")}
╚════════════════════════════════════════════════════════════════╝

Please create a .env file in the root directory with these variables.
Sample .env file:

${missingEnvVars.map((envVar) => `${envVar}=your_${envVar.toLowerCase()}_here`).join("\n")}
`);
	}
}
