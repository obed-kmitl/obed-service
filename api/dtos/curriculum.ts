import {
	IsNotEmpty, IsString, IsOptional, IsNumber,
} from 'class-validator';

export class CreateCurriculumRequestDTO {
	@IsString()
	@IsNotEmpty()
	title : string= '';

	@IsOptional()
	@IsString()
	university? : string= '';

	@IsOptional()
	@IsString()
	department? : string= '';

	@IsOptional()
	@IsString()
	faculty? : string= '';
}

export class UpdateCurriculumRequestDTO {
	@IsOptional()
	@IsString()
	title? : string= undefined;

	@IsOptional()
	@IsString()
	university? : string= '';

	@IsOptional()
	@IsString()
	department? : string= '';

	@IsOptional()
	@IsString()
	faculty? : string= '';
}

export class CurriculumInputDTO {
	@IsOptional()
	@IsNumber()
	curriculum_id? : number= undefined;

	@IsOptional()
	@IsString()
	title? : string= undefined;

	@IsOptional()
	@IsString()
	university? : string= '';

	@IsOptional()
	@IsString()
	department? : string= '';

	@IsOptional()
	@IsString()
	faculty? : string= '';
}
