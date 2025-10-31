import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateGroupDto {
  @ApiProperty({ example: "ИС-223", description: "Название группы" })
  @IsNotEmpty()
  name: string;
}