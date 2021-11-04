import {
	IsNotEmpty, IsString, IsOptional, IsNumber, Length, IsArray,
} from 'class-validator';

export class CreateCourseRequestDTO {
	@IsNotEmpty()
	@IsString()
	@Length(8, 8)
	course_id : string='';

	@IsNotEmpty()
	@IsNumber()
	curriculum_id : number=-1;

	@IsOptional()
	@IsString()
	@Length(8, 8)
	pre_course_id?: string= undefined;

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

export class CreateCourseInputDTO {
	@IsNotEmpty()
	@IsString()
	@Length(8, 8)
	course_id : string='';

	@IsNotEmpty()
	@IsNumber()
	curriculum_id : number=-1;

	@IsOptional()
	@IsString()
	@Length(8, 8)
	pre_course_id?: string= undefined;

	@IsNotEmpty()
	@IsString()
	course_name_en : string='';

	@IsNotEmpty()
	@IsString()
	course_name_th: string='';

	@IsNotEmpty()
	@IsArray()
	relative_standards: Number[][]= [];
}

export class UpdateCourseRequestDTO {
	@IsOptional()
	@Length(0, 8)
	@IsString()
	@Length(8, 8)
	pre_course_id?: string= undefined;

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
	pre_course_id?: number= undefined;

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
