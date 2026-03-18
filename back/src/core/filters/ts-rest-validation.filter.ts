import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class TsRestValidationFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()

		if (exception?.response?.bodyResult || exception?.response?.paramsResult || exception?.response?.queryResult) {
			const messages = [
				...(exception?.response?.bodyResult?.issues ?? []),
				...(exception?.response?.paramsResult?.issues ?? []),
				...(exception?.response?.queryResult?.issues ?? []),
				...(exception?.response?.headersResult?.issues ?? []),
			].map(i => i.message)

			return response.status(400).json({
				statusCode: 400,
				error: 'Bad Request',
				message: messages.length ? messages : ['Bad Request']
			})
		}

		const status = exception?.status ?? 500
		return response.status(status).json({
			statusCode: status,
			error: exception?.response?.error ?? 'Internal Server Error',
			message: exception?.response?.message ?? exception?.message ?? 'Internal Server Error'
		})
	}
}