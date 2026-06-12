import { z } from "zod";

const keyValuePair = z.object({
	key: z.string(),
	value: z.string(),
});

export const AppVariableParam = z.object({
	key: z.string(),
});

export const getAppVariables = z.array(keyValuePair);
export type GetVariablesDto = z.infer<typeof getAppVariables>;

export const createAppVariable = keyValuePair;
export type CreateVariableDto = z.infer<typeof createAppVariable>;

export const editAppVariable = z.object({
	value: z.string(),
});
export type EditVariableDto = z.infer<typeof editAppVariable>;
