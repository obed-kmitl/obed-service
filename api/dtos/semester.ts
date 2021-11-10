import {
	IsArray,
	IsNotEmpty, IsNumber,
} from 'class-validator';

export class CreateSemesterRequestDTO {
	@IsNotEmpty()
	@IsNumber()
	year_number : Number=-1;
}

export class CreateGroupSectionsRequestDTO {
	@IsNotEmpty()
	@IsNumber({}, { each: true })
	@IsArray()
	course_id_list: Number[]= [];
}

export class CreateSectionRequestDTO {
	@IsNotEmpty()
	@IsNumber()
	section_number: Number=-1;

	@IsNotEmpty()
	@IsNumber({}, { each: true })
	@IsArray()
	user_id_list: Number[]= [];
}

export class SectionInputDTO {
	@IsNotEmpty()
	@IsNumber()
	section_number: Number=-1;
}

export class UpdateSectionRequestDTO {
	@IsNotEmpty()
	@IsNumber()
	section_number: Number=-1;

	@IsNotEmpty()
	@IsNumber({}, { each: true })
	@IsArray()
	user_id_list: Number[]= [];
}
