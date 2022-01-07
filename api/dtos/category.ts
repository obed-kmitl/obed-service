import {
	IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max,
} from 'class-validator';

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
	section_id?: number= -1;

	@IsNotEmpty()
	@IsString()
	title: string= '';

  @IsNotEmpty()
	@IsNumber()
  @Min(0)
  @Max(100)
	weight: number= -1;
}
