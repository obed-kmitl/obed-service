import {
	IsNotEmpty, IsString, IsOptional, IsNumber, Length, IsArray,
} from 'class-validator';

export class CreateSemesterRequestDTO {
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
