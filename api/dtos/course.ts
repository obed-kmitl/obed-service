import { Type } from 'class-transformer';
import {
	IsNotEmpty, IsString, IsOptional, IsNumber, Length, IsArray, IsDefined, ValidateNested,
} from 'class-validator';

export class CreateCourseRequestDTO {
	@IsNotEmpty()
	@IsNumber()
	curriculum_id : number=-1;

	@IsOptional()
	@IsNumber()
	pre_course_id?: Number= undefined;

	@IsNotEmpty()
	@IsString()
	@Length(8, 8)
	course_number : string='';

	@IsNotEmpty()
	@IsString()
	course_name_en : string='';

	@IsNotEmpty()
	@IsString()
	course_name_th: string='';

	@IsNotEmpty()
	@IsArray()
	@IsNumber({}, { each: true })
	relative_standards: Number[]= [];
}

export class CreateAllCourseRequestDTO {
  @IsDefined()
  @ValidateNested({ each: true })
	@IsNotEmpty()
	@IsArray()
  @Type(() => CreateCourseRequestDTO)
	courses: CreateCourseRequestDTO[]= [];
}

export class CreateCourseInputDTO {
	@IsNotEmpty()
	@IsNumber()
	curriculum_id : number=-1;

	@IsOptional()
	@IsNumber()
	pre_course_id?: Number= undefined;

	@IsNotEmpty()
	@IsString()
	@Length(8, 8)
	course_number : string='';

	@IsNotEmpty()
	@IsString()
	course_name_en : string='';

	@IsNotEmpty()
	@IsString()
	course_name_th: string='';
}

export class UpdateCourseRequestDTO {
	@IsOptional()
	@IsNumber()
	pre_course_id?: Number= undefined;

	@IsOptional()
	@IsString()
	@Length(8, 8)
	course_number : string='';

	@IsOptional()
	@IsString()
	course_name_en?: string= undefined;

	@IsOptional()
	@IsString()
	course_name_th?: string= undefined;

	@IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	relative_standards?: Number[]= undefined;
}

export class CourseInputDTO {
	@IsOptional()
	@IsNumber()
	pre_course_id?: Number= undefined;

	@IsOptional()
	@IsString()
	@Length(8, 8)
	course_number : string='';

	@IsOptional()
	@IsString()
	course_name_en?: string= undefined;

	@IsOptional()
	@IsString()
	course_name_th?: string= undefined;

	@IsNotEmpty()
	@IsArray()
	relative_standards: Number[][]= [];
}
