/*
This code isn't in typescript because eslint can't handle raw typescript alone.
Considering the size of the code, I consider not a worth trade-off to make eslint
compatible with TS just for this. However if the plugin grow (which I doubt a lot)
it may be interesting to consider to change this.
*/

import { objectNewlineKeyValue } from "./rules/object-newline-key-value/index.mjs";

export const localPlugin = {
	rules: {
		"object-newline-key-value": objectNewlineKeyValue
	}
}
