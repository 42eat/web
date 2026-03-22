import {
	ArgumentsHost,
	Catch,
	ConflictException,
	ExceptionFilter,
	NotFoundException,
} from "@nestjs/common";
import { Response } from "express";
import { Prisma } from "../../generated/prisma/client";

interface TsRestException {
	response?: {
		bodyResult?: { issues: { message: string }[] };
		paramsResult?: { issues: { message: string }[] };
		queryResult?: { issues: { message: string }[] };
		headersResult?: { issues: { message: string }[] };
		error?: string;
		message?: string | string[];
	};
	status?: number;
	message?: string;
}

@Catch()
export class TsRestValidationFilter implements ExceptionFilter {
	catch(exception: TsRestException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		if (exception instanceof Prisma.PrismaClientKnownRequestError) {
			if (exception.code === "P2002") {
				return response.status(409).json({
					statusCode: 409,
					error: "Conflict",
					message: "This element already exists",
				});
			}

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

		if (
			exception?.response?.bodyResult ||
			exception?.response?.paramsResult ||
			exception?.response?.queryResult
		) {
			const messages = [
				...(exception?.response?.bodyResult?.issues ?? []),
				...(exception?.response?.paramsResult?.issues ?? []),
				...(exception?.response?.queryResult?.issues ?? []),
				...(exception?.response?.headersResult?.issues ?? []),
			].map((i) => i.message);

			return response.status(400).json({
				statusCode: 400,
				error: "Bad Request",
				message: messages.length ? messages : ["Bad Request"],
			});
		}

		const status = exception?.status ?? 500;
		return response.status(status).json({
			statusCode: status,
			error: exception?.response?.error ?? "Internal Server Error",
			message:
				exception?.response?.message ??
				exception?.message ??
				"Internal Server Error",
		});
	}
}
