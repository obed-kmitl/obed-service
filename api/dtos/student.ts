import {
	IsNotEmpty, IsString, IsNumber, IsArray,
} from 'class-validator';

export class CreateStudentDTO {
	@IsNotEmpty()
	@IsNumber()
	section_id : number=-1;

  @IsNotEmpty()
	@IsString()
	prefix : string='';

  @IsNotEmpty()
	@IsString()
	student_number : string='';

  @IsNotEmpty()
	@IsString()
	firstname : string='';

  @IsNotEmpty()
	@IsString()
	lastname : string='';
}

export class CreateStudentRequestDTO {
  @IsNotEmpty()
  @IsArray()
  students : CreateStudentDTO[] = [];
}

export class UpdateStudentRequestDTO {
  @IsNotEmpty()
	@IsString()
	prefix : string='';

  @IsNotEmpty()
	@IsString()
	student_number : string='';

  @IsNotEmpty()
	@IsString()
	firstname : string='';

  @IsNotEmpty()
	@IsString()
	lastname : string='';
}
