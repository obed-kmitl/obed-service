import {
	IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max, IsArray,
} from 'class-validator';

export class CreateCLORequestDTO {
	@IsNotEmpty()
	@IsNumber()
	section_id : number= -1;

	@IsNotEmpty()
	@IsString()
	detail: string= '';

  @IsNotEmpty()
	@IsString()
	order_number : string= '';

  @IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	relative_standards?: number[]= undefined;
}

export class UpdateCLORequestDTO {
	@IsNotEmpty()
	@IsString()
	detail: string= '';

  @IsNotEmpty()
	@IsString()
	order_number : string= '';

  @IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	relative_standards?: number[]= undefined;
}
