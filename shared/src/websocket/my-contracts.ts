import z from "zod";
import { w } from "./my-builder";

export const testContract = w.router({
	a: w.router({
		b: {
			name: ".a",
			permissions: [],
			events: {
				eventA: {
					name: ".thisEvent",
					data: z.string(),
				},
			},
		},
	}, { prefix: "test" }),
});

void testContract.a.b.name;
