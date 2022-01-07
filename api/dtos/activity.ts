import {
	IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max,
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

export class CreateCategoryRequestDTO {
	@IsNotEmpty()
	@IsNumber()
	section_id : number= -1;

	@IsNotEmpty()
	@IsString()
	title: string= '';

  @IsNotEmpty()
	@IsNumber()
  @Min(0)
  @Max(100)
	weight: number= -1;
}
