import {
	IsNotEmpty, IsString, IsOptional, IsNumber,
} from 'class-validator';

export class CreateCurriculumRequestDTO {
		@IsString()
		@IsNotEmpty()
		title : string= '';
}

export class UpdateCurriculumRequestDTO {
	@IsOptional()
	@IsNumber()
	main_standard_id? : number= undefined;

	@IsOptional()
	@IsNumber()
	relative_standard_id?: number= undefined;

	@IsOptional()
	@IsString()
	title? : string= undefined;
}

export class CurriculumInputDTO {
	@IsOptional()
	@IsNumber()
	curriculum_id? : number= undefined;

	@IsOptional()
	@IsNumber()
	main_standard_id? : number= undefined;

	@IsOptional()
	@IsNumber()
	relative_standard_id?: number= undefined;

	@IsOptional()
	@IsString()
	title? : string= undefined;
}
