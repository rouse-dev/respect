import { ApiProperty } from "@nestjs/swagger";

export class CreateGroupDto {
  @ApiProperty({ example: "ИС-223", description: "Название группы" })
  name: string;
}