export function createJwtPayload(memberId: number, emailVerified: boolean) {
	return { sub: memberId, emailVerified };
}

export type JwtPayload = ReturnType<typeof createJwtPayload>;
