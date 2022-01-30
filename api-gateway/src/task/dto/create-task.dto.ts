import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
