import {
	IsNotEmpty, IsString, IsOptional, IsNumber, IsArray, ArrayMaxSize, ArrayMinSize,
} from 'class-validator';

export class NextImprovement {
  @IsNotEmpty()
  @IsString()
  title: string = '';

  @IsNotEmpty()
  @IsString({ each: true })
  cause : string[] = [];

  @IsNotEmpty()
  @IsString({ each: true })
  work : string[] = [];

  @IsNotEmpty()
  @IsString({ each: true })
  evaluation : string[] = [];
}

export class SaveReportRequestDTO {
  @IsOptional()
  @IsNumber()
	report_id?: number;

  @IsOptional()
  @IsNumber()
  section_id?: number = -1;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(8)
  @ArrayMaxSize(8)
  @IsNumber({}, { each: true })
  grade : number[] = [0, 0, 0, 0, 0, 0, 0, 0];

  @IsNotEmpty()
  @IsString({ each: true })
  prev_improvement : string[] = [];

  @IsNotEmpty()
  @IsString({ each: true })
  verify_method : string[] = [];

  @IsNotEmpty()
  @IsString({ each: true })
  summary : string[] = [];

  @IsNotEmpty()
  @IsString({ each: true })
  next_improvements: any[]= [];
}
