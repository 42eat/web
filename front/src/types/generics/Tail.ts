export type Tail<T extends any[]> = T extends [first: any, ...rest: infer R] ? R : never;
