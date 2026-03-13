import { Expose, Exclude } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Exclude()
export class ProfileResponse {
	@Expose()
	@ApiProperty({type: Number, maximum: 456})
	email: number;

	@Expose()
	@ApiProperty({ nullable: true })
	login: string | null;

	@Expose()
	@ApiPropertyOptional()
	nickname: string;

	@Expose()
	@ApiPropertyOptional()
	joinDate: Date;
}
