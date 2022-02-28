import {
	IsNotEmpty, IsString, IsOptional, IsNumber, IsArray, ArrayMaxSize, ArrayMinSize,
} from 'class-validator';

export class NextImprovement {
  @IsNotEmpty()
  @IsString()
  title: string = '';

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  cause : string[] = [];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  work : string[] = [];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  evaluation : string[] = [];
}

export class SaveReportRequestDTO {
  @IsNotEmpty()
  @IsNumber()
  section_id: number = -1;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(8)
  @ArrayMaxSize(8)
  @IsNumber({}, { each: true })
  grade : number[] = [0, 0, 0, 0, 0, 0, 0, 0];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  prev_improvement : string[] = [];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  verify_method : string[] = [];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  summary : string[] = [];

  @IsNotEmpty()
  @IsArray()
  next_improvements: NextImprovement[]= [];
}
