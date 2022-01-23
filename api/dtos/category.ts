import {
	IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max, IsArray,
} from 'class-validator';

export class Category {
	@IsOptional()
	@IsNumber()
	section_id? : number= undefined;

  @IsNotEmpty()
	@IsNumber()
	category_id: number| string= -1;

	@IsNotEmpty()
	@IsString()
	title: string= '';

  @IsNotEmpty()
	@IsNumber()
  @Min(0)
  @Max(100)
	weight: number= -1;
}

export class SaveCategoryRequestDTO {
  @IsNotEmpty()
	@IsNumber()
	section_id : number= -1;

  @IsArray()
  categories : Category[] = [];
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

export class UpdateCategoryRequestDTO {
	@IsOptional()
	@IsNumber()
	category_id?: number= undefined;

	@IsNotEmpty()
	@IsString()
	title: string= '';

  @IsNotEmpty()
	@IsNumber()
  @Min(0)
  @Max(100)
	weight: number= -1;
}
