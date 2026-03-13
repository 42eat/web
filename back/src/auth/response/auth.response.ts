import { ApiProperty } from "@nestjs/swagger";

export class AuthResponse {
	@ApiProperty()
	accessToken: string;
}
