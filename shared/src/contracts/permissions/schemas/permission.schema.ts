import { z } from 'zod'
import { PERMISSIONS } from '../../../core/permissions'

const toZodObject = <T extends Record<string, Record<string, string>>>(obj: T) =>
	z.object(
		Object.fromEntries(
			Object.entries(obj).map(([k, v]) => [k, z.object(
				Object.fromEntries(Object.entries(v).map(([k2]) => [k2, z.string()]))
			)])
		)
	)

export const PermissionsResponseSchema = toZodObject(PERMISSIONS)

export type PermissionsResponse = z.infer<typeof PermissionsResponseSchema>
