export type Shape<T> = {
	[K in keyof T]: T[K] extends object ? Shape<T[K]> : string;
};
