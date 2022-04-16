import { Transform, Type } from 'class-transformer';
import {
	IsNotEmpty, IsString, IsOptional, IsNumber,
	IsArray, IsBoolean, ArrayNotEmpty, MaxLength,
} from 'class-validator';

export class CreateActivityRequestDTO {
	@IsNotEmpty()
	@IsNumber()
	section_id : number= -1;

	@IsOptional()
	@IsNumber()
	category_id?: Number= undefined;

	@IsNotEmpty()
	@IsString()
	title: string= '';

	@IsOptional()
	@IsString()
	detail?: string= undefined;

  @IsNotEmpty()
	@IsString()
	type: string= '';
}

export class UpdateActivityRequestDTO {
	@IsOptional()
	@IsNumber()
	category_id?: Number= undefined;

	@IsNotEmpty()
	@IsString()
	title: string= '';

	@IsOptional()
	@IsString()
	detail?: string= undefined;

  @IsNotEmpty()
	@IsString()
	type: string= '';
}
export class CreateSubActivityRequestDTO {
	@IsNotEmpty()
	@IsNumber()
	activity_id : number= -1;

	@IsOptional()
	@IsString()
	detail?: string= undefined;

  @IsNotEmpty()
	@IsNumber()
	max_score: number= -1;

  @IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	clos?: number[]= undefined;
}
export class CreateSubActivityForClassroomRequestDTO {
	activity_id : number;

	detail?: string;

	max_score: number;

	clos: number[];
}

export class UpdateSubActivityRequestDTO {
	@IsOptional()
	@IsString()
	detail?: string= undefined;

  @IsNotEmpty()
	@IsNumber()
	max_score: number= -1;

  @IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	clos?: number[]= undefined;
}

export class CreateActivityFromClassroomRequestDTO {
  @IsNotEmpty()
	@IsNumber()
	section_id : number= -1;

	@IsNotEmpty()
	@IsString()
	title: string= '';

	@IsOptional()
	@IsString()
	detail?: string= undefined;

  @IsNotEmpty()
	@IsNumber()
	max_score: number= -1;

  @IsNotEmpty()
  @ArrayNotEmpty()
	@IsArray()
	@IsNumber({}, { each: true })
	clos: number[]= [];

  @IsNotEmpty()
  @IsBoolean()
  allowImportStudentScore: boolean = false;

  @IsOptional()
	@IsString()
	googleCourseId?: string= undefined;

  @IsOptional()
	@IsString()
	googleCourseWorkId?: string= undefined;
}
