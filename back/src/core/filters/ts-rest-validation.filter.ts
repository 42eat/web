import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Code401, Code403, code401, code403 } from "@42eat-web/shared";
import { Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import { env } from "../env";

interface TsRestException {
	response?: {
		bodyResult?: { issues: { message: string }[] };
		paramsResult?: { issues: { message: string }[] };
		queryResult?: { issues: { message: string }[] };
		headersResult?: { issues: { message: string }[] };
		error?: string;
		message?: string | string[];
		code?: string;
	};
	status?: number;
	message?: string;
}

@Catch()
export class TsRestValidationFilter implements ExceptionFilter {
	catch(exception: TsRestException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		if (env.NODE_ENV === "dev") {
			console.error(exception);
		}

		// Format prisma errors
		if (exception instanceof Prisma.PrismaClientKnownRequestError) {
			// Global conflict management -> no need to do 2 query each time
			// (one to verify if the element exist, the other to set),
			// we can just do one insert query and if there is a conflict
			// the interceptor return a beautiful error
			if (exception.code === "P2002") {
				return response.status(409).json({
					statusCode: 409,
					error: "Conflict",
					message: "This element already exists",
				});
			}

			// Same as the conflict but for the not found exception. For example, I try to add the role
			// x to the user y, and x or y doesn't exist in db, prisma will throw an error.
			// This interceptor format the error for the api, and so we don't have to check for x and y before
			// adding our row.
			if (exception.code === "P2003") {
				const meta = exception.meta as {
					driverAdapterError?: {
						cause?: {
							originalMessage?: string;
						};
					};
				};

				return response.status(404).json({
					statusCode: 404,
					error: "Not found",
					message: "Related resource not found",
					detail: meta?.driverAdapterError?.cause?.originalMessage,
				});
			}
		}

		// Format the zod errors
		// Actually, with ts rest we have zod schema to validate the user input,
		// but the error isn't really practicaly usable in the front end, so this
		// part of the interceptor simplify it in a much more usable way
		if (exception?.response?.bodyResult || exception?.response?.paramsResult || exception?.response?.queryResult) {
			const messages = [
				...(exception?.response?.bodyResult?.issues ?? []),
				...(exception?.response?.paramsResult?.issues ?? []),
				...(exception?.response?.queryResult?.issues ?? []),
				...(exception?.response?.headersResult?.issues ?? []),
			].map((i) => i.message);

			return response.status(400).json({
				statusCode: 400,
				error: "Bad Request",
				message: messages.length
					? messages
					: ["Bad Request"],
			});
		}

		const status = exception?.status ?? 500;

		// In the case of an unauthorized error, I ensure the type is valid
		// for the front
		if (status === 401) {
			const responseCode = exception?.response?.code;
			const code: Code401
				= responseCode && code401.includes(responseCode as Code401)
					? (responseCode as Code401)
					: "UNAUTHORIZED";

			return response.status(401).json({
				statusCode: 401,
				error: "Unauthorized",
				message: exception?.response?.message ?? "Unauthorized",
				code,
			});
		} else if (status === 403) {
			const responseCode = exception?.response?.code;
			const code: Code403
				= responseCode && code403.includes(responseCode as Code403)
					? (responseCode as Code403)
					: "FORBIDDEN";

			return response.status(403).json({
				statusCode: 403,
				error: "Forbidden",
				message: exception?.response?.message ?? "Forbidden",
				code,
			});
		}

		// Just return the error if it was something else
		return response.status(status).json({
			statusCode: status,
			error: exception?.response?.error ?? "",
			message: exception?.response?.message
				?? exception?.message
				?? "Internal Server Error",
		});
	}
}
