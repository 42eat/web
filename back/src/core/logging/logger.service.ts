import { Injectable, LoggerService } from "@nestjs/common";
import { env } from "../env";
import { Logger, createLogger, format, transports } from "winston";

interface LogContext {
	action: string;
	[key: string]: unknown;
}

const devLogsFormat = format.combine(
	format.colorize(),
	format.printf(({ timestamp, level, message }: Record<string, unknown>) => {
		return `${String(timestamp)} [${String(level)}] ${typeof message === "string"
			? message
			: JSON.stringify(message)}`;
	}),
);


@Injectable()
export class WinstonLoggerService implements LoggerService {
	private logger: Logger;

	constructor() {
		const isDev = env.NODE_ENV === "dev";

		this.logger = createLogger({
			level: "info",
			format: format.combine(
				format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				format.errors({ stack: true }),
				format.splat(),
				isDev
					? devLogsFormat
					: format.json(),
			),
			defaultMeta: { service: "42eat-api" },
			transports: [
				new transports.Console(),
				new transports.File({
					filename: "logs/error.log",
					level: "error",
					maxsize: 5242880,
					maxFiles: 5,
				}),
				new transports.File({
					filename: "logs/combined.log",
					maxsize: 5242880,
					maxFiles: 5,
				}),
			],
		});
	}

	log(message: string | LogContext, context?: string) {
		if (typeof message === "object") {
			this.logger.info(message);
		} else {
			this.logger.info(message, { context });
		}
	}

	error(message: string | LogContext, trace?: string | Error, context?: string) {
		if (typeof message === "object") {
			this.logger.error(message);
		} else {
			this.logger.error(message, {
				trace: trace instanceof Error
					? trace.stack
					: trace,
				context,
			});
		}
	}

	warn(message: string | LogContext, context?: string) {
		if (typeof message === "object") {
			this.logger.warn(message);
		} else {
			this.logger.warn(message, { context });
		}
	}
}
