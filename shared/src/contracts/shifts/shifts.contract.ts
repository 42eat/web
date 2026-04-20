import { initContract } from "@ts-rest/core";
import { shiftPositionsContract } from "./shift-positions.contract";
import { shiftTypesContract } from "./shift-types.contract";

const c = initContract();

export const shiftsContract = c.router(
	{
		positions: shiftPositionsContract,
		types: shiftTypesContract,
	},
	{ pathPrefix: "/shifts" },
);
