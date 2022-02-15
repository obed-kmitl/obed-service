import {
	IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max, IsArray,
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
