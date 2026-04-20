import { initContract } from "@ts-rest/core";
import { shiftPositionsContract } from "./shift-positions.contract";

const c = initContract();

export const shiftsContract = c.router(
	{
		positions: shiftPositionsContract,
	},
	{ pathPrefix: "/shifts" },
);
