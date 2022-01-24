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
	@IsNumber()
	order_number : number=-1;
}

export class UpdateCLORequestDTO {
	@IsNotEmpty()
	@IsString()
	detail: string= '';

  @IsNotEmpty()
	@IsNumber()
	order_number : number=-1;

  @IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	relative_standards?: number[]= undefined;
}
