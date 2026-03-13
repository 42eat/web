import { Expose, Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

@Exclude()
export class ProfileResponse {
	@Expose()
	@ApiProperty()
	email: string;

	@Expose()
	@ApiProperty()
	login: string | null;

	@Expose()
	@ApiProperty()
	nickname: string | null;

	@Expose()
	@ApiProperty()
	join_date: Date | null;
}
