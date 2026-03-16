import { Expose, Exclude } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Exclude()
export class ProfileResponse {
	@Expose()
	email: number;

	@Expose()
	login: string | null;

	@Expose()
	nickname: string;

	@Expose()
	joinDate: Date;
}
