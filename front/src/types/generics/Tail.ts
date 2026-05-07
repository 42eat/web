export type Tail<T extends any[]> = [
	T extends (first: any, ...rest: infer R) => any
		? R
		: never,
];
