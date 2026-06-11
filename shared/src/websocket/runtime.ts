import { SocketContractDef } from "./types";
import { RoomNames, RoomParams } from "./infer";

export function resolveRoom<
	TContract extends SocketContractDef<any, any>,
	TName extends RoomNames<TContract>,
>(
	_contract: TContract,
	name: TName,
	params: RoomParams<TContract, TName>,
): string {
	if (!params) return name as string;
	return (name as string).replace(/:(\w+)/g, (_, key: string) => String((params as Record<string, unknown>)[key]));
}

export function resolveEvent(eventName: string): string {
	return eventName;
}

export type RoomInfo<
	TContract extends SocketContractDef<any, any>,
	TName extends RoomNames<TContract>,
> = {
	pattern: TName;
	resolved: string;
};

export function useRoom<
	TContract extends SocketContractDef<any, any>,
	TName extends RoomNames<TContract>,
>(
	_contract: TContract,
	name: TName,
	params: RoomParams<TContract, TName>,
): RoomInfo<TContract, TName> {
	return {
		pattern: name,
		resolved: (name as string).replace(/:(\w+)/g, (_, key: string) => String((params as Record<string, unknown>)[key])),
	};
}
