type LogLevel = "debug" | "info" | "warn" | "error";

interface LoggerOptions {
	level: LogLevel;
	enableConsole: boolean;
	enableStorage: boolean;
	maxStorageSize?: number;
}

class Logger {
	private options: LoggerOptions = {
		level: process.env.NODE_ENV === "development" ? "debug" : "info",
		enableConsole: true,
		enableStorage: true,
		maxStorageSize: 1000,
	};

	private logLevels: Record<LogLevel, number> = {
		debug: 0,
		info: 1,
		warn: 2,
		error: 3,
	};

	constructor(options?: Partial<LoggerOptions>) {
		this.options = { ...this.options, ...options };
	}

	private shouldLog(level: LogLevel): boolean {
		return this.logLevels[level] >= this.logLevels[this.options.level];
	}

	private formatMessage(
		level: LogLevel,
		message: string,
		...args: any[]
	): string {
		const timestamp = new Date().toISOString();
		const formattedArgs = args
			.map((arg) =>
				typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg
			)
			.join(" ");

		return `[${timestamp}] ${level.toUpperCase()}: ${message} ${formattedArgs}`;
	}

	private store(logEntry: string) {
		if (!this.options.enableStorage) return;

		try {
			const key = "application_logs";
			const existingLogs = localStorage.getItem(key);
			const logs = existingLogs ? JSON.parse(existingLogs) : [];

			logs.push(logEntry);

			// Trim logs if they exceed maxStorageSize
			if (logs.length > (this.options.maxStorageSize || 1000)) {
				logs.shift();
			}

			localStorage.setItem(key, JSON.stringify(logs));
		} catch (error) {
			console.error("Failed to store log:", error);
		}
	}

	debug(message: string, ...args: any[]) {
		if (!this.shouldLog("debug")) return;
		const logEntry = this.formatMessage("debug", message, ...args);
		if (this.options.enableConsole) {
			console.debug(logEntry);
		}
		this.store(logEntry);
	}

	info(message: string, ...args: any[]) {
		if (!this.shouldLog("info")) return;
		const logEntry = this.formatMessage("info", message, ...args);
		if (this.options.enableConsole) {
			console.info(logEntry);
		}
		this.store(logEntry);
	}

	warn(message: string, ...args: any[]) {
		if (!this.shouldLog("warn")) return;
		const logEntry = this.formatMessage("warn", message, ...args);
		if (this.options.enableConsole) {
			console.warn(logEntry);
		}
		this.store(logEntry);
	}

	error(message: string, ...args: any[]) {
		if (!this.shouldLog("error")) return;
		const logEntry = this.formatMessage("error", message, ...args);
		if (this.options.enableConsole) {
			console.error(logEntry);
		}
		this.store(logEntry);
	}

	getLogs(): string[] {
		try {
			const logs = localStorage.getItem("application_logs");
			return logs ? JSON.parse(logs) : [];
		} catch {
			return [];
		}
	}

	clearLogs() {
		try {
			localStorage.removeItem("application_logs");
		} catch (error) {
			console.error("Failed to clear logs:", error);
		}
	}
}

export const logger = new Logger();
