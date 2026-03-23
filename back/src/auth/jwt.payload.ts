export function createJwtPayload(memberId: number) {
	return { sub: memberId };
}

export type JwtPayload = ReturnType<typeof createJwtPayload>;
